document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');
    let vocabularyData = []; // To store the loaded vocabulary

    // 1. Load the vocabulary data
    async function word() {
        try {
            // 确保 vocabulary_corpus.json 与 index.html 在同一仓库的同一级别或可访问路径
            const response = await fetch('word.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            vocabularyData = await response.json();
            console.log('Vocabulary loaded successfully:', vocabularyData.length, 'words');
            // 可选：构建一个更快的查找结构，例如一个对象/map
            // buildIndex();
        } catch (error) {
            console.error('Error loading vocabulary:', error);
            resultsDiv.innerHTML = '<p>Error loading vocabulary data. Please try again later.</p>';
        }
    }

    // 可选：为快速查找构建索引 (如果数据量大，这很重要)
    let wordIndex = {};
    function buildIndex() {
        wordIndex = vocabularyData.reduce((acc, entry) => {
            if (entry.word) {
                acc[entry.word.toLowerCase()] = entry;
            }
            return acc;
        }, {});
        console.log("Index built.");
    }


    // 2. Search function
    function searchWord(term) {
        resultsDiv.innerHTML = ''; // Clear previous results
        if (!term) {
            resultsDiv.innerHTML = '<p>Please enter a word to search.</p>';
            return;
        }

        const searchTerm = term.toLowerCase();
        let foundEntry = null;

        // 如果使用了索引:
        // foundEntry = wordIndex[searchTerm];

        // 如果没有使用索引 (遍历数组):
        if (vocabularyData && vocabularyData.length > 0) {
             foundEntry = vocabularyData.find(entry => entry.word && entry.word.toLowerCase() === searchTerm);
        } else {
            resultsDiv.innerHTML = '<p>Vocabulary data not loaded yet or is empty.</p>';
            return;
        }


        if (foundEntry) {
            displayEntry(foundEntry);
        } else {
            resultsDiv.innerHTML = `<p>Word "${term}" not found.</p>`;
        }
    }

    // 3. Display function
    function displayEntry(entry) {
        let content = `<h2>${entry.word}</h2>`;
        if (entry.phonetic) content += `<p><strong>Phonetic:</strong> ${entry.phonetic}</p>`;
        if (entry.definition) content += `<p><strong>Definition:</strong> ${entry.definition}</p>`;
        if (entry.etymology) content += `<p><strong>Etymology:</strong> ${entry.etymology}</p>`;
        if (entry.phrase) content += `<p><strong>Phrase:</strong> ${entry.phrase}</p>`;
        if (entry.example) content += `<p><strong>Example:</strong> ${entry.example}</p>`;
        if (entry.culture) content += `<p><strong>Culture:</strong> ${entry.culture}</p>`;
        resultsDiv.innerHTML = content;
    }

    // Event listeners
    searchButton.addEventListener('click', () => searchWord(searchInput.value));
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchWord(searchInput.value);
        }
    });

    // Load data when the page loads
    loadVocabulary().then(() => {
        if (vocabularyData && vocabularyData.length > 0) {
             buildIndex(); // 构建索引以加快搜索速度
        }
    });
});
