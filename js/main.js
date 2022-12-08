// fetch employees information
fetch( 'https://randomuser.me/api/?results=20&nat=gb')
    .then( response => response.json() )
    .then( generateCards )
    .catch( error => console.log("Something went wrong when creating cards!", error) );


const $gallery = $('#gallery');
const $modal_container = $('.modal-container');
const $card_imgs = $('.card-img');
const employeesNum = 20;
const jobs = [ "Accountant",  "Internal Auditor", "Analyst Programmer", "Web Programmer", "Test Analyst", "Tax Accountant", "System Analyst", "Database Administrator"];

function getJob() {
    const index = Math.floor(Math.random() * jobs.length);
    return jobs[index];
}

// generate HTML markups for employees
function generateCards(data) {
    data.results.map( (p, index) => { 
        const job = getJob();

        const $imgContainer = $('<div></div>')
            .addClass('card-img-container')
            .html(`
                <img class="card-img" src=${ p.picture.large } alt="profile picture">
            `);
        const $infoContainer = $('<div></div>')
            .addClass('card-info-container')
            .html(`
                <h3 id="name" class="card-name cap">${ p.name.first } ${ p.name.last }</h3>
                <p class="card-text card-position">${ job }</p>
                <p class="card-text">${ p.email }</p>
            `);

        const $card = $('<div></div>', {'class': 'card', id: `card-${index}`})
            .append($imgContainer, $infoContainer);

        $gallery.append($card);

        generateOverlay(p, job, index);
    });
}


// generate overlay for each employee detail info
function generateOverlay(p, job, index) {
    const l = p.location;

    const $close = $('<button type="button" id="modal-close-btn" class="btn-close btn"><strong>X</strong></button>');
    const $modalInfo = $('<div class="modal-info-container">')
        .html(`
            <img class="modal-img" src=${ p.picture.large } alt="profile picture">
            <h3 id="name" class="modal-name cap">${ p.name.first } ${ p.name.last }</h3>
            <p class="modal-text">${ job }</p>
            <p class="modal-text">${ p.email }</p>
            <p class="modal-text upper">${ p.location.city }</p>
            <hr>
            <p class="modal-text">${ p.phone }</p>
            <p class="modal-text">${ l.street.number }, ${ l.street.name }, ${ l.city}
            <br>${ l.country }, ${ l.postcode }</p>
            <p class="modal-text">Birthday : ${ dateFormate(p.dob.date) }</p>
        `);
        
    const $modal = $('<div></div>', {'class': 'modal', id: `modal-${index}`})
        .append($close,  $modalInfo);
    
    $modal_container.append($modal);

    $modal.hide();
}


// convert date string to dd/mm/yyyy formate
function dateFormate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${day}/${month}/${year}`;
}


// add EventListener for dynamic elements
for(let i = 0; i < employeesNum; i++) {
    $gallery.on('click', `#card-${ i }`, () => {
        $modal_container.show();
        $(`#modal-${ i }`)
            .show()
            .addClass('selected');
        $('body').addClass('noscroll');  //prevent body to scroll when overlay shows
    });

    $modal_container.on('click', '#modal-close-btn', () => {
        $modal_container.hide();
        $(`#modal-${i}`)
            .hide()
            .removeClass('selected');
        $('body').removeClass('noscroll');
    });
}


// add EventListener for prev button
$('#modal-prev').click( () => {
    let indexStr = $('.selected').attr('id').substring(6);
    let index = parseInt(indexStr, 10);
    if(index > 0) {
        let temp = index;
        while($(`#card-${temp - 1}`).hasClass('card-hide')) {
            temp -= 1;
        }
        if(temp !== 0) {
            $(`#modal-${index}`)
                .hide()
                .removeClass('selected');
            // console.log(temp - 1);
            $(`#modal-${temp - 1}`)
                .show()
                .addClass('selected');
        }
    } 
});


// add EventListener for next button
$('#modal-next').click( () => {
    let indexStr = $('.selected').attr('id').substring(6);
    let index = parseInt(indexStr, 10);
    if(index < employeesNum - 1){
        let temp = index;
        while($(`#card-${temp + 1}`).hasClass('card-hide')) {
            temp += 1;
        }
        if(temp !== employeesNum - 1) {
            $(`#modal-${index}`)
                .hide()
                .removeClass('selected');
            // console.log(temp + 1);
            $(`#modal-${temp + 1}`)
                .show()
                .addClass('selected');
        }
    }     
});


// add EventListener for search button
$('#search-input').keyup( () => {
    const $searchStr = $('#search-input').val();
    searchByNameOrPosition($searchStr);
});

$('#search-submit').click( () => {
    const $searchStr = $('#search-input').val();
    searchByNameOrPosition($searchStr);
});


function searchByNameOrPosition(searchStr) {
    const $card = $('.card');
    $card.each( function(index) {
        const name = $(this).find('.card-name').text().toLowerCase();
        const position = $(this).find('.card-position').text().toLowerCase();
        const regex = new RegExp(`^([a-zA-Z]* )?${searchStr}`);
        if( regex.test(name) || regex.test(position)) {
            $(`#card-${index}`).removeClass('card-hide');
        } else {
            $(`#card-${index}`).addClass('card-hide');
        }       
    });
}