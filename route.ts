import { StreamingTextResponse, LangChainStream, OpenAIStream } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAI } from "langchain/llms/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { LLMChain, RetrievalQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { BaseCallbackConfig } from "langchain/callbacks";
import {
  collapseDocs,
  splitListOfDocs,
} from "langchain/chains/combine_documents/reduce";
import { Document } from "langchain/document";
import { StringOutputParser } from "langchain/schema/output_parser";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "langchain/schema/runnable";
import { Tiktoken } from "tiktoken/lite";
import { load } from "tiktoken/load";
import registry from "tiktoken/registry.json";
import models from "tiktoken/model_to_encoding.json";

/** OpenAIの内部処理をログ出力するフラグ */
const verbose = true;

/** システムプロンプト */
const systemPrompt = `Please create the minutes according to [Rules] and [Format].
[Context]
{context}

[Rules]
- Include title, date, location, attendees, topics, todo items, and decisions.

[Format]
## Title:  
## Date:  
## Location:  
## Attendees:  
## Topics:  
## Todo:  
## Decisions:  `;

/** モデル名 */
const modelName = "gpt-3.5-turbo";
let model = null;

/** パーサー */
const outputParser = new StringOutputParser();

const { stream, handlers } = LangChainStream();

export async function POST(req: Request) {
  // チャットメッセージ取得
  const { messages, outputLang } = await req.json();
  const lastHumanMessage = await messages[messages.length - 1];

  const message = lastHumanMessage.content.slice(1);
  const docs = message
    .split("- ")
    .map((pageContent: string) => new Document({ pageContent }));

  model = await load(registry[models[modelName]]);

  // 言語把握
  const outputLanguage = await language(docs);

  // 議事録作成
  const agenda = await mapAgendaChain.invoke(docs);

  // 翻訳
  const translateLlm = new ChatOpenAI({
    modelName,
    streaming: true,
    temperature: 0,
  });
  const translateChain = new LLMChain({
    llm: translateLlm,
    prompt: new PromptTemplate({
      inputVariables: ["agenda"],
      template: `Translate to ${outputLanguage}: {agenda}`,
    }),
  });
  translateChain.call({ agenda: `${agenda}` }, [handlers]).catch((e) => {
    console.log(e);
  });

  return new StreamingTextResponse(stream);
}

// 議事録作成
const agendaLlm = new ChatOpenAI({
  modelName,
  temperature: 0,
  //maxTokens,
  verbose,
});

// Document[]をstringに変換する
const formatDocs = async (documents: Document[]): Promise<string> =>
  documents.map((doc) => doc.pageContent).join("\n\n");

// ドキュメントのトークンを計算する
const getNumTokens = async (docs: Document[]): Promise<number> => {
  const encoder = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str
  );

  let docToken = 0;
  try {
    docToken = encoder.encode(
      docs.map((doc) => doc.pageContent).join("\n\n")
    ).length;
  } catch (e) {
    throw e;
  } finally {
    encoder.free();
  }
  return docToken;
};

// ドキュメントをトークン上限まで折りたたむ。上限内ならそのまま返す
const collapse = async (
  documents: Document[],
  config?: BaseCallbackConfig,
  tokenMax = agendaLlm.maxTokens ?? 4000
) => {
  const editableConfig = config;
  let docs = documents;
  let collapseCount = 1;
  while ((await getNumTokens(docs)) > tokenMax) {
    if (editableConfig) {
      editableConfig.runName = `Collapse ${collapseCount}`;
    }
    const splitDocs = splitListOfDocs(docs, getNumTokens, tokenMax);
    docs = await Promise.all(
      splitDocs.map((doc) => collapseDocs(doc, collapseChain.invoke))
    );
    collapseCount += 1;
  }
  return docs;
};

/**
 * 要約Chain
 */
const summarizeChain = RunnableSequence.from([
  { context: async (i: Document) => i.pageContent },
  PromptTemplate.fromTemplate("Summarize this content:\n\n{context}"),
  agendaLlm,
  outputParser,
]);

/**
 * 文章結合Chain
 */
const collapseChain = RunnableSequence.from([
  {
    context: async (docs: Document[]) => {
      console.log(docs);
      return formatDocs(docs);
    },
  },
  PromptTemplate.fromTemplate("Collapse this content:\n\n{context}"),
  agendaLlm,
  outputParser,
]);

/**
 * 議事録作成Chain
 */
const agedaChain = RunnableSequence.from([
  { context: formatDocs },
  PromptTemplate.fromTemplate(systemPrompt),
  agendaLlm,
  outputParser,
]).withConfig({ runName: "Reduce" });

// 議事録Chain
const mapAgendaChain = RunnableSequence.from([
  RunnableSequence.from([
    { doc: new RunnablePassthrough(), content: summarizeChain },
    (input) => new Document({ pageContent: input.content }),
  ])
    .withConfig({ runName: "Summarize (return doc)" })
    .map(), // 1.文章をDocument毎に要約する
  collapse, // 2.要約した文章をトークン上限値まで折り畳む
  agedaChain, // 3.折りたたんだ文章で議事録を作成する
]).withConfig({ runName: "Map reduce" });

/**
 * 入力値の言語を返す
 * @param docs Document[]
 * @returns 言語
 */
const language = async (docs: Document[]) => {
  const vectorStoreData = await MemoryVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    })
  );
  const languageChain = RetrievalQAChain.fromLLM(
    new OpenAI({ modelName, temperature: 0 }),
    vectorStoreData.asRetriever(),
    { returnSourceDocuments: false }
  );
  return await languageChain.run("Return only one human language used.");
};
