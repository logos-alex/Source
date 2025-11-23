// Lunr.js Search Logic for heb-sources

let searchIndex, searchData;

// 1. טעינת האינדקס והנתונים
async function loadSearchData() {
    try {
        const response = await fetch('/search.json');
        searchData = await response.json();
        
        // יצירת אינדקס Lunr
        searchIndex = lunr(function () {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('content');
            this.field('book');
            this.field('source');

            searchData.forEach(function (doc) {
                this.add(doc);
            }, this);
        });
        console.log("Lunr index loaded successfully.");
    } catch (error) {
        console.error("Error loading search data:", error);
        document.getElementById('searchResults').innerHTML = '<p style="color: red;">אירעה שגיאה בטעינת מנוע החיפוש.</p>';
    }
}

// 2. פונקציית החיפוש
function search(query) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    if (!query || query.trim() === '') {
        resultsContainer.innerHTML = '<p>הקלד מונח חיפוש כדי להתחיל.</p>';
        return;
    }

    if (!searchIndex) {
        resultsContainer.innerHTML = '<p>מנוע החיפוש עדיין נטען, אנא המתן רגע.</p>';
        return;
    }

    // ביצוע החיפוש
    const lunrResults = searchIndex.search(query);

    if (lunrResults.length === 0) {
        resultsContainer.innerHTML = `<p>לא נמצאו תוצאות עבור: <strong>${query}</strong></p>`;
        return;
    }

    // הצגת התוצאות
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';

    lunrResults.forEach(result => {
        // מציאת המסמך המקורי לפי ה-id (ה-URL)
        const doc = searchData.find(d => d.id === result.ref);
        if (!doc) return;

        const li = document.createElement('li');
        li.style.marginBottom = '20px';
        li.style.borderBottom = '1px dashed var(--border-color)';
        li.style.paddingBottom = '10px';

        const link = document.createElement('a');
        link.href = doc.id;
        link.innerHTML = `<h3>${doc.title}</h3>`;
        link.style.textDecoration = 'none';
        link.style.color = 'var(--header-color)';

        const snippet = document.createElement('p');
        snippet.innerHTML = `**מקור:** ${doc.source || 'לא ידוע'} | **ספר:** ${doc.book || 'לא ידוע'}`;
        snippet.style.fontSize = '0.9em';
        snippet.style.color = 'var(--notes-color)';

        li.appendChild(link);
        li.appendChild(snippet);
        ul.appendChild(li);
    });

    resultsContainer.appendChild(ul);
    resultsContainer.insertAdjacentHTML('afterbegin', `<p>נמצאו ${lunrResults.length} תוצאות:</p>`);
}

// 3. אתחול והאזנה לאירועים
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    
    // טעינת הנתונים
    loadSearchData();

    // האזנה להקלדה
    if (searchInput) {
        searchInput.addEventListener('keyup', (event) => {
            // חיפוש רק לאחר שהמשתמש הפסיק להקליד לזמן קצר (debounce)
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
                search(event.target.value);
            }, 250);
        });
    }
});
