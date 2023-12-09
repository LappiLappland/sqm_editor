export function saveFile(filename: string, text: string) {
  const link = document.createElement('a');
  const file = new Blob([text], { type: 'text/plain' });
  link.href = URL.createObjectURL(file);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function uploadFile() {
  const contentPromise = new Promise<string>((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      if (!e.target) {reject(null); return;}
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      const file = target.files[0] as Blob;
      if (!file) {reject(null); return;}
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
  
      reader.onload = readerEvent => {
        if (!readerEvent.target) return;
        const content = readerEvent.target.result+'';
        resolve(content);
      };
    };
  
    input.click();
  });
  return contentPromise;
}