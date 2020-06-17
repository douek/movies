const waitFor = selector => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (document.querySelector(selector)) {
          clearInterval(interval);
          clearTimeout(timeout);
          resolve();
        }
      }, 30);
   
      const timeout = setTimeout(() => {
        clearInterval(interval);
        reject();
      }, 2000);
    });
  };

beforeEach(() => {
    document.querySelector('#target').innerHTML =''
    createAutoComplete({
        root: document.querySelector('#target'),
        fetchData() {
            return [{Title: "Movie 1"},
            {Title: "Movie 3"},
            {Title: "show"},
            {Title: "uthred son of uthred"}]
        },
        renderOption(movie){
            return movie.Title
        }
    })
})

it("Dropdown stars closed", () => {

    const dropdown = document.querySelector('.dropdown')
    expect(dropdown.className).not.to.include('is-active')
})

it("drop down active after searching",async ()=>{
    const input = document.querySelector('.input')
    input.value = "fish loves babe"
    input.dispatchEvent(new Event('input'))

    await waitFor('.dropdown-item')

    const dropdown = document.querySelector('.dropdown')
    expect(dropdown.className).to.include('is-active')
})

it("results after searching",async ()=>{
    const input = document.querySelector('.input')
    input.value = "fish loves babe"
    input.dispatchEvent(new Event('input'))

    await waitFor('.dropdown-item')

    const items = document.querySelectorAll('.dropdown-item')
    expect(items.length).to.equal(4)
})