"use client";

import React, { useCallback, useMemo } from "react";

import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { Label } from "@/components/ui/label";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Task } from "@/components/table/data/schema";
//import { useToast } from "@/components/ui/use-toast";
//import { Button } from "@/components/ui/button";
//import { ToastAction } from "@/components/ui/toast";
import { SpeechServiceApi as speechService } from "@/features/azure-client/speech-services";

let data = null;
//async function getData(): Promise<Task[]> {
//  data = json;
//}

export default function Voice() {
  //const { toast } = useToast();
  data = json;

  const onDrop = useCallback(async (files: File[]) => {
    console.log("files:", files);

    // Azureストレージにアップロード

    // バッチ依頼
    /*
    console.log(
      "TranscriptionId: ",
      await speechService.createTranscription(
        files[0].name,
        "ja-JP",
        "onsei/test.WAV"
      )
    );

    const status = await speechService.getTranscription(
      "760a3c31-be88-461c-b761-56a0e7b4a36a"
    );
    console.log(status);
    const ret = await speechService.getTranscriptionFiles(
      "760a3c31-be88-461c-b761-56a0e7b4a36a"
    );
    console.log(ret);
    */
    const fileData = await speechService.getFileTest(
      "https://spsvcprodjpe.blob.core.windows.net/bestor-948e9f4b-98f0-414a-b695-603be7bddabe/TranscriptionData/760a3c31-be88-461c-b761-56a0e7b4a36a_0_0.json?skoid=c243ab90-da1a-4893-986b-063e4b26bd23&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skt=2023-11-20T15%3A32%3A40Z&ske=2023-11-25T15%3A37%3A40Z&sks=b&skv=2023-08-03&sv=2023-08-03&st=2023-11-20T15%3A32%3A40Z&se=2023-11-21T03%3A37%3A40Z&sr=b&sp=rl&sig=46M90VD%2BpoupRqfi%2F377dEKA0MGQLF7pPweEDKgxBo8%3D"
    );
    console.log(fileData);
    // TranscriptionId, ファイル名, ストレージURL をDBに保存
  }, []);
  const { getRootProps, getInputProps, isDragActive, open, acceptedFiles } =
    useDropzone({ onDrop });
  const filesUpdated: FileWithPath[] = acceptedFiles;

  const files = useMemo(
    () =>
      filesUpdated.map((file: FileWithPath) => (
        <Label>
          {file.path} - {file.size} {console.log(file.stream())}bytes
        </Label>
      )),
    [filesUpdated]
  );

  return (
    <div>
      {/*<Button
        onClick={() => {
          toast({
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }}
      >
        Show Toast
      </Button>*/}
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">音声変換</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          {/*<div className="flex items-center space-x-2">
            <UserNav />
      </div>*/}
        </div>
        <div className="container w-full">
          <div
            {...getRootProps()}
            className="py-8 border-8 border-dashed flex items-center justify-center"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="">Drag & Drop / Select file from dialog</p>
            ) : (
              <p className="">Drag & Drop / Select file from dialog</p>
            )}
          </div>
          <div className="flex flex-col">
            <h4 className="">File: </h4>
            {files}
          </div>
        </div>
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}

const json = [
  {
    id: "TASK-8782",
    title:
      "You can't compress the program without quantifying the open-source SSD pixel!",
    status: "in progress",
    created: "2023/11/01 10:00",
  },
  {
    id: "TASK-7878",
    title:
      "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
    status: "failed",
    created: "2023/08/01 10:00",
  },
  {
    id: "TASK-7839",
    title: "We need to bypass the neural TCP card!",
    status: "done",
    label: "bug",
    created: "2023/09/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "canceled",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
  {
    id: "TASK-5562",
    title:
      "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
    status: "failed",
    label: "feature",
    created: "2023/12/01 10:00",
  },
];
