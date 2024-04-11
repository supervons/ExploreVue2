<template>
  <div class="hello"></div>
</template>
<script>
import streamSaver from "streamsaver";
export default {
  name: "BigFileRequest",
  created() {
    // const url = "/qqfile/qq/PCQQ9.7.17/QQ9.7.17.29225.exe";
    // const url = "/files/10Gb.dat";
    const url = "/download?size=10737418240";
    // const url =
    //   "/2019WinterFCS/fullrestores/041-39257/32129B6C-292C-11E9-9E72-4511412B0A59/iPhone_4.7_12.1.4_16D57_Restore.ipsw";
    streamSaver.mitm = "/mitm.html";
    const fileStream = streamSaver.createWriteStream("10Gb.dat");
    fetch(url).then((res) => {
      const readableStream = res.body;

      // more optimized
      if (window.WritableStream && readableStream.pipeTo) {
        return readableStream
          .pipeTo(fileStream)
          .then(() => console.log("done writing"));
      }

      window.writer = fileStream.getWriter();

      const reader = res.body.getReader();
      const pump = () =>
        reader
          .read()
          .then((res) =>
            res.done
              ? window.writer.close()
              : window.writer.write(res.value).then(pump)
          );

      pump();
    });
  },
};
</script>
<style scoped></style>
