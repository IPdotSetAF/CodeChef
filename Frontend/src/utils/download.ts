import JSZip from "jszip";

export async function downloadFilesAsZip(files: File[], fileName: string) {
    const zip = new JSZip();
    files.forEach(file => zip.file(file.name, file.arrayBuffer()));
    const content = await zip.generateAsync({ type: 'blob' });
    downloadFile(new File([content], 'converted-fonts.zip', { type: 'application/zip' }));
}

export function downloadFile(file: File): void {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
}
