//<button id="get">Get</button>
//<button id="post">Post</button>

const getButton = document.getElementById('get');
const postButton = document.getElementById('post');

getButton.addEventListener('click', () => {
    fetch('http://localhost:8080/feed/posts')
    .then(res => {
        return res.json();
    })
    .then(resDate => console.log(resDate)) 
    .catch(err => {
        console.error(err)
    })
});

postButton.addEventListener('click', () => {
    fetch('http://localhost:8080/feed/post',{
        method: 'POST',
        body: JSON.stringify({
            title: 'codepen',
            content: 'codepen content'
        }),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    .then(res => {
        return res.json()
    })
    .then(date => console.log(date))
    .catch(err => console.error(err));
});