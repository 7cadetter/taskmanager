fetch('http://localhost:3000/data')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(item => {
            const percent = (item.watched / item.episodes) * 100;

            const box = document.createElement("div");
            box.className = "itembox";
            box.setAttribute('id', item.id);

            const boximg = document.createElement("img");
            boximg.className = "boximg";
            box.appendChild(boximg);

            const content = document.createElement("div");
            content.className = "boxcontent";
            box.appendChild(content);

            const boxtitle = document.createElement("p");
            boxtitle.className = "boxtitle";
            content.appendChild(boxtitle);

            const circle = document.createElement("div");
            circle.className = "percentage-circle";
            content.appendChild(circle);
            circle.style.setProperty('--percentage', percent);

            const inner = document.createElement("div");
            inner.className = "innercircle";
            circle.appendChild(inner);

            const text1 = document.createElement("span");
            text1.className = "text1";
            inner.appendChild(text1);
            text1.textContent = `${item.watched}/${item.episodes}`;

            const text2 = document.createElement("span");
            text2.className = "text2";
            inner.appendChild(text2);
            text2.textContent = `${Math.round(percent)}%`;

            const actions = document.createElement("div");
            actions.className = "actionsbox";
            content.appendChild(actions);

            const addbutton = document.createElement("button");
            addbutton.className = "addbutton";
            actions.appendChild(addbutton);
            addbutton.setAttribute('type', 'button');
            addbutton.textContent = "Add Episode";

            const removebutton = document.createElement("button");
            removebutton.className = "removebutton";
            actions.appendChild(removebutton);
            removebutton.setAttribute('type', 'button');
            removebutton.textContent = "Remove Episode";

            const finishbutton = document.createElement("button");
            finishbutton.className = "finishbutton";
            actions.appendChild(finishbutton);
            finishbutton.setAttribute('type', 'button');
            finishbutton.textContent = "Finish";

            boxtitle.innerText = item.title;
            box.setAttribute('data-current', item.watched);
            box.setAttribute('data-max', item.episodes);
            boximg.setAttribute('src', item.image_url);
            boximg.setAttribute('alt', item.title);

            document.body.appendChild(box);
        });
    })
    .catch(error => console.error('Error fetching data:', error));


const percentageCircles = document.querySelectorAll('.percentage-circle');
const addButtons = document.querySelectorAll('.addbutton');
const removeButtons = document.querySelectorAll('.removebutton');

document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('addbutton')) {
        const parentbox = event.target.closest('.itembox');
        const currentEpisodes = parseInt(parentbox.getAttribute('data-current'));
        const maxEpisodes = parseInt(parentbox.getAttribute('data-max'));

        if (currentEpisodes < maxEpisodes) {
            incrementWatched(parentbox.id, '+');
            const newEpisodes = currentEpisodes + 1;
            parentbox.setAttribute('data-current', newEpisodes);
            const percent = (newEpisodes / maxEpisodes) * 100;

            const percentCircle = parentbox.querySelector('.percentage-circle');
            percentCircle.style.setProperty('--percentage', percent);

            const innerCircle = parentbox.querySelector('.innercircle');
            innerCircle.querySelector('.text1').innerText = `${newEpisodes}/${maxEpisodes}`;
            innerCircle.querySelector('.text2').innerText = `${Math.round(percent)}%`;
        }
    } else if (event.target.classList.contains('removebutton')) {
        const parentbox = event.target.closest('.itembox');
        const currentEpisodes = parseInt(parentbox.getAttribute('data-current'));
        const maxEpisodes = parseInt(parentbox.getAttribute('data-max'));

        if (currentEpisodes > 0) {
            incrementWatched(parentbox.id, '-');
            const newEpisodes = currentEpisodes - 1;
            parentbox.setAttribute('data-current', newEpisodes);
            const percent = (newEpisodes / maxEpisodes) * 100;

            const percentCircle = parentbox.querySelector('.percentage-circle');
            percentCircle.style.setProperty('--percentage', percent);

            const innerCircle = parentbox.querySelector('.innercircle');
            innerCircle.querySelector('.text1').innerText = `${newEpisodes}/${maxEpisodes}`;
            innerCircle.querySelector('.text2').innerText = `${Math.round(percent)}%`;
        }  
    }   
})

// addButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         const itemBox = button.closest('.itembox');
//         const currentEpisodes = parseInt(itemBox.getAttribute('data-current'));
//         const maxEpisodes = parseInt(itemBox.getAttribute('data-max'));

//         if (currentEpisodes < maxEpisodes) {
//             incrementWatched(itemBox.id, '+');
//             const newEpisodes = currentEpisodes + 1;
//             itemBox.setAttribute('data-current', newEpisodes);
//             const percent = (newEpisodes / maxEpisodes) * 100;

//             const percentCircle = itemBox.querySelector('.percentage-circle');
//             percentCircle.style.setProperty('--percentage', percent);

//             const innerCircle = itemBox.querySelector('.innercircle');
//             innerCircle.querySelector('.text1').innerText = `${newEpisodes}/${maxEpisodes}`;
//             innerCircle.querySelector('.text2').innerText = `${Math.round(percent)}%`;
//         }
//     });
// });

// removeButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         const itemBox = button.closest('.itembox');
//         const currentEpisodes = parseInt(itemBox.getAttribute('data-current'));
//         const maxEpisodes = parseInt(itemBox.getAttribute('data-max'));

//         if (currentEpisodes > 0) {
//             incrementWatched(itemBox.id, '-');
//             const newEpisodes = currentEpisodes - 1;
//             itemBox.setAttribute('data-current', newEpisodes);
//             const percent = (newEpisodes / maxEpisodes) * 100;

//             const percentCircle = itemBox.querySelector('.percentage-circle');
//             percentCircle.style.setProperty('--percentage', percent);

//             const innerCircle = itemBox.querySelector('.innercircle');
//             innerCircle.querySelector('.text1').innerText = `${newEpisodes}/${maxEpisodes}`;
//             innerCircle.querySelector('.text2').innerText = `${Math.round(percent)}%`;
//         }
//     });
// });

percentageCircles.forEach(circle => {
    const innerCircle = circle.querySelector('.innercircle');
    const text1 = innerCircle.querySelector('.text1');

    circle.addEventListener('mouseenter', () => {
        circle.classList.add('persistent-animation');
        text1.classList.add('lowering_anim');
    });

    circle.addEventListener('mouseleave', () => {
        circle.classList.remove('persistent-animation');
        text1.classList.remove('lowering_anim');
    });
});

function incrementWatched(id, inorde) {
    fetch(`http://localhost:3000/data/${inorde}/${id}`, {
        method: 'PUT',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to increment record');
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error incrementing data:', error));
}
