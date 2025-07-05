const xhr = new XMLHttpRequest();

xhr.addEventListener("load" , () => {
    console.log(xhr.response);
})

xhr.open('GET','https://supersimplebackend.dev/');
xhr.send();

// The same as searching for https://supersimplebackend.dev/ in the browser (its type is GET)