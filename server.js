const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));[span_6](start_span)[span_6](end_span)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));[span_7](start_span)[span_7](end_span)
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);[span_8](start_span)[span_8](end_span)
        });
        
