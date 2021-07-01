//получаем идентификатор элемента
var a = document.getElementById('switch'),
    b = document.getElementById('languages'),
    с = document.getElementById('currents'),
    modalData = [],
    dataArray = [],
    //Получение массива из локалки
    userData = JSON.parse(localStorage.getItem("UserData"));

var dataLC = [
    [{'value': 'EUR', 'url': '/', 'id': '1'},
    {'value': 'USD', 'url': '/', 'id': '6'},
    {'value': 'RUB', 'url': '/', 'id': '7'}],
    [{'value': 'RU', 'name': '[RU] Русский'},
    {'value': 'EN', 'name': '[EN] Английский'}]
];
    
var langHtml = "",
    cursHtml = "";

//Языки в списке
dataLC[1].map(function(l) {
    langHtml += '<option value='+ l.value +'>'+ l.name +'</option>';
    document.getElementById('languages').innerHTML = langHtml;
});

//Курсы в списке
dataLC[0].map(function(c) {
    cursHtml += '<option value='+ c.value +' url='+ c.url +' id='+ c.id +'>'+ c.value +'</option>';
    document.getElementById('currents').innerHTML = cursHtml;
});

fetch('https://beautyhub.pro/ajax/country_ajax.php')
.then((response) => {
    return response.json();
})
.then((data) => {
var countrys = data.map(function(country) {
    var name = country.name,
        iso = country.iso,
        lang = country.lang,
        current_name = country.current_name,
        id = country.id;

    let optionList = document.createElement('option');

    optionList.innerHTML = '[' + iso + '] '+ name +'';
    optionList.value = iso;
    optionList.setAttribute('lang', lang);
    optionList.setAttribute('current_name', current_name);
    optionList.setAttribute('id', id);
    optionList.setAttribute('name', name);
    a.append(optionList);

    dataArray.push({
        'name': name,
        'iso': iso,
        'lang': lang,
        'current_name': current_name,
        'id': id
    });

    if(userData !== null){
        if(iso == userData[0].country){
            optionList.selected = true;
        }
    }
});
});

//дожидаемся полной загрузки страницы
window.onload = function () {

    //Выбор страны
    a.onclick = function Countries () {
        document.getElementById('country').innerHTML = this.value;
        ModalData();
    }

    //Выбор языка
    b.onclick = function Language () {
        document.getElementById('language').innerHTML = this.value;
        ModalData();
    }

    //Выбор валюты
    с.onclick = function Currents () {
        document.getElementById('current').innerHTML = this.value;
        ModalData();
    }

    //Массив выбранных элементов
    function ModalData () {
        let country = document.getElementById('country').innerHTML,
            language = document.getElementById('language').innerHTML,
            current = document.getElementById('current').innerHTML,
            urlSet = document.querySelector('#currents option[value = '+ current +']'),
            current_id = document.querySelector('#currents option[value = '+ current +']').getAttribute('id');

        modalData.splice(0, modalData.length);
        modalData.push({
            'country': country,
            'language': language,
            'current': current,
            'url': '/'+ language.toLowerCase() +'',
            'current_id': '?currency_id='+ current_id +'',
        });             

        //Записали в LocalStorange
        localStorage.setItem('UserData', JSON.stringify(modalData));
        SendModal();
    }

    //Применить
    function SendModal () {
        document.querySelector('.send_window').onclick = function () {
            userDataCountry = modalData[0].country;
            userDataLanguage = modalData[0].language;
            userDataCurrent = modalData[0].current;
            userDataUrl = modalData[0].url;
            userDataCurrentId = modalData[0].current_id;

            window.location.href = ''+ userDataUrl +'/'+ userDataCurrentId +'';
        }
    }

    //defoul значение
    var date = new Date(Date.now() + 86400e3),
        resultsCookie = document.cookie.match(/UserData=(.+?)(;|$)/),
        modalViewData = document.querySelector('.modal-view_data');

    date = date.toUTCString();
    document.cookie = 'UserData = 1;expires='+ date +'';

    if(userData !== null){
        userDataCountry = userData[0].country;
        userDataLanguage = userData[0].language;
        userDataCurrent = userData[0].current;

        document.getElementById('country').innerHTML = userDataCountry;
        document.getElementById('language').innerHTML = userDataLanguage;
        document.getElementById('current').innerHTML = userDataCurrent;

        if('EN' == userDataLanguage){
            b.querySelector('option[value='+ userDataLanguage +']').selected = true;
        }

        if('USD' == userDataCurrent){
            document.getElementById('currents').querySelector('option[value='+ userDataCurrent +']').selected = true;
        } else if('RUB' == userDataCurrent) {
            document.getElementById('currents').querySelector('option[value='+ userDataCurrent +']').selected = true;
        }

        //записали в Cookies
        document.cookie = 'UserData = '+ localStorage.getItem('UserData') +';expires='+ date +'';
    }

    if(resultsCookie[1].length < 3){
        modalViewData.classList.add('active');
        localStorage.removeItem('UserData');
    }
}