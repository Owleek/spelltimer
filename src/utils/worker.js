self.onmessage = event => {
    setInterval(() => {
        self.postMessage(`nofify after`);
    }, event.data);
};