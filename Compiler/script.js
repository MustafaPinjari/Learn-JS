// Initialize the Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.28.1/min/vs' }});

window.MonacoEnvironment = {
    getWorkerUrl: function () {
        return URL.createObjectURL(new Blob([`
            self.MonacoEnvironment = { baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.28.1/min/' };
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.28.1/min/vs/base/worker/workerMain.js');
        `], { type: 'application/javascript' }));
    }
};

require(['vs/editor/editor.main'], function () {
    var editor = monaco.editor.create(document.getElementById('code-editor'), {
        value: '// Write your JavaScript code here...\n',
        language: 'javascript',
        theme: 'vs-light',
        automaticLayout: true
    });

    // Function to capture console output
    function captureConsoleLogs() {
        var logs = [];
        var originalLog = console.log;
        console.log = function (message) {
            logs.push(message);
            originalLog.apply(console, arguments);
        };
        return logs;
    }

    // Run Button
    document.getElementById('run-btn').addEventListener('click', function () {
        var code = editor.getValue();
        var logs = captureConsoleLogs();
        document.getElementById('output').innerHTML = ''; // Clear previous output

        try {
            // Create a function scope to avoid leaking variables
            new Function(code)();
            
            // Display logs captured in console.log
            logs.forEach(log => {
                var logElement = document.createElement('div');
                logElement.textContent = log;
                document.getElementById('output').appendChild(logElement);
            });
            
            // Append success message
            var successMessage = document.createElement('div');
            successMessage.textContent = 'Code executed successfully!';
            document.getElementById('output').appendChild(successMessage);
        } catch (error) {
            var errorElement = document.createElement('div');
            errorElement.textContent = `Error: ${error.message}`;
            document.getElementById('output').appendChild(errorElement);
        }
    });

    // Clear Button
    document.getElementById('clear-btn').addEventListener('click', function () {
        editor.setValue('');
        document.getElementById('output').innerHTML = ''; // Clear output area
    });

    // Fullscreen Button
    document.getElementById('fullscreen-btn').addEventListener('click', function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    // Theme Toggle Button
    document.getElementById('theme-toggle-btn').addEventListener('click', function () {
        if (editor._themeService._theme.themeName === 'vs-dark') {
            monaco.editor.setTheme('vs-light');
            localStorage.setItem('editor-theme', 'light');
        } else {
            monaco.editor.setTheme('vs-dark');
            localStorage.setItem('editor-theme', 'dark');
        }
    });

    // Share Button (Sample)
    document.getElementById('share-btn').addEventListener('click', function () {
        var code = editor.getValue();
        var encodedCode = encodeURIComponent(code);
        var shareUrl = window.location.origin + window.location.pathname + '?code=' + encodedCode;
        alert('Shareable link: ' + shareUrl);
    });

    // Download Button (Sample)
    document.getElementById('download-btn').addEventListener('click', function () {
        var code = editor.getValue();
        var blob = new Blob([code], { type: 'text/javascript' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'main.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Load Theme from Local Storage
    var savedTheme = localStorage.getItem('editor-theme');
    if (savedTheme === 'dark') {
        monaco.editor.setTheme('vs-dark');
    } else {
        monaco.editor.setTheme('vs-light');
    }
});
