const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

//fetch songs
async function searchSongs(song) {
    const res = await fetch(`${apiURL}/suggest/${song}`);
    const data = await res.json();
    showData(data);
}

//Get More songs
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    showData(data);
}

//Get song by artist and song name
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
    console.log(data);
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    result.innerHTML = `
        <h2 style="text-align: center;"><strong>${artist}</strong> - ${songTitle}</h2>
        <p>${lyrics}</p>
    `;
    more.innerHTML = '';
}


//show data
function showData(data) {
    document.querySelector('.loader-container').style.display = 'none';
    // data.data.forEach(song => {
    //     output += `
    //         <li>
    //             <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    //             <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    //         </li>
    //     `;
    // });

    // result.innerHTML = `
    //     <ul class="songs">
    //         ${output}
    //     </ul>
    // `;
    result.innerHTML = `
        <ul class="songs">
            ${data.data
                .map(song => `
                <li>
                    <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                    <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
                </li>
                `).join('')
            }
        </ul>
    `;

    if(data.prev || data.next) {
        more.innerHTML = `
            ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`: ''}
            ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    } else {
        more.innerHTML = '';
    }
}


//Event Listeners
form.addEventListener('submit', e => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    if(!searchTerm) {
        alert('Please type in a search term');
    } else {
        document.querySelector('.loader-container').style.display = 'flex';
        searchSongs(searchTerm);
    }
});

result.addEventListener('click', e => {
    const clickedEl = e.target;
    if(clickedEl.tagName === 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');
        getLyrics(artist, songTitle);
    }
});
