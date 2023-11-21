import axios from "axios";

const REGION = "japaneast";
const OCP_APIM_SUBSCRIPTION_KEY = "1166c66e553143708a00bf939819bdb1";
const BLOB_NAME = "tmstrage01";
const baseURL = `https://${REGION}.api.cognitive.microsoft.com/speechtotext/v3.1/`;

export class SpeechServiceApi {
  private static getTranscriptionId = (selfUrl: string) => {
    const tmp = selfUrl.split("/");
    return tmp[tmp.length - 1];
  };

  /**
   * Create Transcription
   * https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create
   * @param displayName ファイル表示名
   * @param locale ロケール
   * @param blobPath ストレージパス
   */
  public static createTranscription = async (
    displayName: string,
    locale: string,
    blobPath: string
  ) => {
    axios({
      baseURL,
      url: `transcriptions`,
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": OCP_APIM_SUBSCRIPTION_KEY,
        "Content-Type": "application/json",
      },
      data: {
        displayName: displayName,
        locale: locale,
        contentUrls: [`https://${BLOB_NAME}.blob.core.windows.net/${blobPath}`],
      },
    }).then((res) => {
      if (res.status === 201) {
        console.log(res.data);
        const transcriptionId = SpeechServiceApi.getTranscriptionId(
          res.data.self
        );
        console.log("TranscriptionId: ", transcriptionId);
        return transcriptionId;
      } else {
        throw new Error(res.statusText);
      }
    });
  };

  /**
   * Get Transcription
   * https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Get
   * @param transcriptionId Transcription Id
   */
  public static getTranscription = async (transcriptionId: string) => {
    axios({
      baseURL,
      url: `transcriptions/${transcriptionId}`,
      headers: { "Ocp-Apim-Subscription-Key": OCP_APIM_SUBSCRIPTION_KEY },
    }).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        const transcriptionId = SpeechServiceApi.getTranscriptionId(
          res.data.self
        );
        const status = res.status;
        return { transcriptionId, status };
      } else {
        throw new Error(res.statusText);
      }
    });
  };

  /**
   * Get Transcription Files
   * https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles
   * @param transcriptionId Transcription Id
   */
  public static getTranscriptionFiles = async (transcriptionId: string) => {
    axios({
      baseURL,
      url: `transcriptions/${transcriptionId}/files`,
      headers: { "Ocp-Apim-Subscription-Key": OCP_APIM_SUBSCRIPTION_KEY },
    }).then((res) => {
      if (res.status === 200) {
        const transcription = res.data.values.find(
          ({ kind }) => kind === "Transcription"
        );
        console.log("downLoadLinks: ", transcription.links);
        return transcription.links;
      } else {
        throw new Error(res.statusText);
      }
    });
  };

  /**
   * Delete Transcription
   * https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete
   * @param transcriptionId Transcription Id
   */
  public static deleteTranscription = async (transcriptionId: string) => {
    axios({
      baseURL,
      url: `transcriptions/${transcriptionId}`,
      method: "delete",
      headers: { "Ocp-Apim-Subscription-Key": OCP_APIM_SUBSCRIPTION_KEY },
    }).then((res) => {
      if (res.status === 204) {
        return;
      } else {
        throw new Error(res.statusText);
      }
    });
  };

  /**
   * テキスト変換されたファイルの文字列を取得する
   * @param url Transcription File URL
   */
  public static getFileTest = async (url: string) => {
    axios.get(url).then((res) => {
      if (res.status === 200) {
        const textArray = [];
        let datas: Array<any> = res.data.combinedRecognizedPhrases;
        for (let i = 0; i < datas.length; i++) {
          textArray.push(datas[i].lexical);
        }
        const text = textArray.join("\n");
        console.log("text: ", text);
        return res.data;
      } else {
        throw new Error(res.statusText);
      }
    });
  };
}
