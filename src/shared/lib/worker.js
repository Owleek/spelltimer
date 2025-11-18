self.onmessage = event => {
    setInterval(() => {
        self.postMessage('...');
    }, event.data);
};

