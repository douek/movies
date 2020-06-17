
const autocompleteConfig = {
    renderOption: (movie) => {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
        return `
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})`
    },
    inputValue: (movie) => (movie.Title),
    fetchData: async (searchTerm) => {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '<API KEY>',
                s: searchTerm
            }
        }
        )
        if (response.data.Error){
            return [];
        }
        return response.data.Search
    }
}

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
    },
})

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'),'right')
    },
})

let leftMovie
let rightMovie
const onMovieSelect = async (movie, target, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '<API KEY>',
            i: movie.imdbID
        }
    })
    target.innerHTML = movieTemplate(response.data)
    if (side === 'left') {
        leftMovie = response.data
    }
    else{
        rightMovie = response.data
    }
    if (leftMovie && rightMovie){
        runComparison()
    }
}

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification')

    leftSideStats.forEach((left,index) => {
        let right = rightSideStats[index]
        console.log(left, right)

        if (parseInt(left.dataset.value) > parseInt(right.dataset.value)){
            right.classList.remove('is-primary')
            right.classList.add('is-warning')
            
        } else {
            left.classList.remove('is-primary')
            left.classList.add('is-warning')
        }
    })
}

const movieTemplate = (movieDetail) => {
    const metascore = parseInt(movieDetail.Metascore)
    const imdbRating = parseFloat(movieDetail.imdbRating)
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''))
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word)
        if (isNaN(value)){
            return prev
        } else {
            return prev + value
        }
    },0)

    return`
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
        <p class="title"> ${movieDetail.Awards} </p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
        <p class="title"> ${movieDetail.Metascore} </p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
        <p class="title"> ${movieDetail.imdbRating} </p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title"> ${movieDetail.imdbVotes} </p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `
}