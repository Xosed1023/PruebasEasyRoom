import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export async function downloadAndOpenPdf({blob, ext, filename}:{blob: Blob, filename: string, ext: string}) {

  // 2. Convierte a base64
  const base64Data = await blobToBase64(blob);

  // 3. Guarda el archivo en el sandbox de la app
  const fileName = `${filename}.${ext}`;
  await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Documents,
  });

  // 4. Obtiene la URI del archivo
  const fileUri = await Filesystem.getUri({
    path: fileName,
    directory: Directory.Documents,
  });

  // 5. Abre el archivo con el visor nativo usando Share
  await Share.share({
    title: 'PDF',
    text: 'PDF',
    url: fileUri.uri,
    dialogTitle: 'Abrir con...',
  });
}

// helper para convertir blob → base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      // quitamos el "data:application/pdf;base64," y dejamos solo el base64
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}
