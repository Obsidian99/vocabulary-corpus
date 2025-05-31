document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');

    async function searchWord(term) {
        resultsDiv.innerHTML = ''; // Clear previous results
        if (!term || term.trim() === '') {
            resultsDiv.innerHTML = '<p>Please enter a word to search.</p>';
            return;
        }

        const searchTerm = term.trim().toLowerCase(); // Normalize: trim and lowercase
        const filePath = `data/${searchTerm}.json`; // Construct path, e.g., data/democracy.json

        try {
            console.log(`Attempting to fetch: ${filePath}`);
            const response = await fetch(filePath);

            if (!response.ok) {
                if (response.status === 404) {
                    resultsDiv.innerHTML = `<p>No data found for "${term}". The file "${filePath}" was not found. Check if the word is correct and the corresponding JSON file exists with a lowercase name in the 'data' folder.</p>`;
                } else {
                    resultsDiv.innerHTML = `<p>Error fetching data for "${term}". Server responded with status: ${response.status}</p>`;
                }
                return;
            }

            const entryData = await response.json();
            displayEntry(entryData, term);

        } catch (error) {
            console.error('Error fetching or parsing word data:', error);
            resultsDiv.innerHTML = `<p>An error occurred while processing "${term}". Please check the console for more details.</p>`;
        }
    }

    function displayEntry(entryData, searchedTermOriginalCase) {
        // entryData is the parsed JSON from a file like data/democracy.json
        // Refer to your "数据结构" image for the fields
        let content = `<h2>${entryData.word || searchedTermOriginalCase}</h2>`; // Use 'word' from JSON, or the user's original input

        if (entryData.phonetics) {
            if (entryData.phonetics.british) {
                content += `<p><strong>British Phonetic:</strong> ${entryData.phonetics.british}</p>`;
            }
            if (entryData.phonetics.american) {
                content += `<p><strong>American Phonetic:</strong> ${entryData.phonetics.american}</p>`;
            }
        }

        if (entryData.definitions && Array.isArray(entryData.definitions) && entryData.definitions.length > 0) {
            content += '<h3>Definitions:</h3>';
            entryData.definitions.forEach((def, index) => {
                content += `<div class="definition-block" style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">`;
                content += `<h4>Definition ${index + 1}</h4>`;
                if (def.partOfSpeech) content += `<p><strong>Part of Speech:</strong> ${def.partOfSpeech}</p>`;
                if (def.definition) content += `<p><strong>Definition (EN):</strong> ${def.definition}</p>`;
                if (def.chineseTranslation) content += `<p><strong>Chinese Translation:</strong> ${def.chineseTranslation}</p>`;
                if (def.level) content += `<p><strong>Level:</strong> ${def.level}</p>`;
                if (def.frequency) content += `<p><strong>Frequency:</strong> ${def.frequency}</p>`;
                if (def.register) content += `<p><strong>Register:</strong> ${def.register}</p>`;
                content += '</div>';
            });
        } else {
            content += '<p>No definitions provided in the data.</p>';
        }

        if (entryData.phrases && Array.isArray(entryData.phrases) && entryData.phrases.length > 0) {
            content += `<h3>Phrases:</h3><ul>`;
            entryData.phrases.forEach(phrase => content += `<li>${phrase}</li>`);
            content += `</ul>`;
        }

        if (entryData.examples && Array.isArray(entryData.examples) && entryData.examples.length > 0) {
            content += `<h3>Examples:</h3><ul>`;
            entryData.examples.forEach(example => content += `<li>${example}</li>`);
            content += `</ul>`;
        }

        if (entryData.etymology) {
            content += `<h3>Etymology:</h3><p>${typeof entryData.etymology === 'string' ? entryData.etymology : JSON.stringify(entryData.etymology)}</p>`;
        }

        // Add more fields as needed from your "数据结构", e.g.:
        // difficultyAnalysis, semanticRelations, culturalContext, memoryAids, grammaticalInfo, metadata
        // Example for a simple object display:
        // if (entryData.difficultyAnalysis) {
        //     content += `<h3>Difficulty Analysis:</h3><pre>${JSON.stringify(entryData.difficultyAnalysis, null, 2)}</pre>`;
        // }

        resultsDiv.innerHTML = content;
    }

    searchButton.addEventListener('click', () => {
        searchWord(searchInput.value);
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchWord(searchInput.value);
        }
    });

    // You could also fetch word.txt here to populate suggestions or for other logic
    // For now, this script directly tries to fetch the word's JSON file.
    console.log("Dictionary script loaded. Ready to search.");
});
