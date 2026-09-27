const loadBtn = document.getElementById('load-btn');
const fileList = document.getElementById('file-list');

loadBtn.addEventListener('click', async () => {
  fileList.innerHTML = '';
  const entries = await window.api.listDir('.');

  entries.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry.isDir ? `📁 ${entry.name}` : `📄 ${entry.name}`;
    li.style.cursor = 'pointer';
    li.style.padding = '5px';
    
    if (entry.isDir) {
        li.style.fontWeight = 'bold';
        li.style.color = '#0056b3';
    }

    if (!entry.isDir) {
      li.addEventListener('dblclick', () => {
        window.api.openFile(entry.fullPath);
      });
    }

    fileList.appendChild(li);
  });
});