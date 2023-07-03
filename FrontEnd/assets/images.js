//********************** IMPORTS *************/

// Recup des images 
//********************** FETCH *************/

const apiUrl = "http://localhost:5678/api/"
const urlWork = `${apiUrl}works`
const reponseCategory = await fetch(`${apiUrl}categories`);
const category = await reponseCategory.json();


//********************** VARIABLES ***********/
const reponseWorks = await fetch(`${urlWork}`);
const library = await reponseWorks.json();
const gallery = document.querySelector(".gallery");
const filter = document.querySelector(".filter");
const  btnFilter = document.querySelector('.btn-filter')
const btnFilterTous = document.querySelector('#filterTous')
const loginContainer = document.querySelector('.login-action-container')


const cardGallery = document.querySelectorAll('.card-gallery')
const modalGallery = document.querySelector('.modal-gallery');
const token = localStorage.getItem('token');




//-------------------- Categories ----------------------------

/**
 * Fonction qui s'initialise au chargement de la page
 */
function init () { 
    library.forEach(async element => {
        worksCreate(element);
    })
    category.forEach((element ,index) => {
        const filterName = 'filter' + element.id;
        filterBouton(element);
        })
        if(isTokenPresent){
            console.log("token present");
            fetch('modal.html')
            .then(response => {
              if (response.ok) {
                return response.text()}
                console.log(response)}
                )
            .then(htmlModal => {
                loginContainer.innerHTML = htmlModal
                console.log( loginContainer);

                    console.log("modal import 1"); 
                    console.log("modal import 2");
    
                    console.log("page chargé")
                    buildContent()
                    submitFunction()
                    loginContainer.addEventListener('click',function(event){
                        const overlay = document.querySelector('.overlay')
                        const modalXmark = document.querySelector('.modal-icon .js-modal-allclose');
                        const modalArrow = document.querySelector('.fa-solid.fa-arrow-left');
                        const modalCtrl = document.querySelector('.modal-controleur')
                        const modalWrapper = document.querySelector('.modal-wrapper');
                        const modalModificationContainer = document.querySelector('#modal-gallery-id');
                        const modalUploadContainer = document.querySelector('#modal-upload-id');
                        if(event.target.classList.contains('js-modal-open')){
                            console.log('click open');
                            event.preventDefault();
                            isActive(overlay);
                            modalWrapper.setAttribute('class','modal-wrapper active height');
                            isActive(modalModificationContainer);
                            isActive(modalCtrl);

                        }
                        else if (event.target.classList.contains('js-modal-allclose')){
                            console.log('click close');
                            event.preventDefault();
                            isClose(overlay);
                            isClose(modalCtrl);
                            modalWrapper.setAttribute('class','modal-wrapper');
                            isClose(modalModificationContainer);
                            isClose(modalXmark);
                            if(modalArrow.classList.contains('active')){isClose(modalArrow);}
                            if(modalUploadContainer.classList.contains('active')){isClose(modalUploadContainer);}
                        }
                        else if (event.target.classList.contains('modal-modification-button')){
                            event.preventDefault();
                            isClose(modalModificationContainer);
                            wrapperHeightRemove(modalWrapper);
                            isActive(modalUploadContainer);
                            isActive(modalArrow);
                        }
                        else if (event.target.classList.contains('fa-arrow-left')){
                            event.preventDefault();
                            isActive(modalModificationContainer);
                            isClose(modalUploadContainer);
                            isClose(modalArrow);
                            wrapperHeightActive(modalWrapper);
                            const i = document.querySelector('.fa-image');
                            const b = document.querySelector('#imgUploadLabel');
                            const p = document.querySelector('.modal-upload-condition');
                            const formUpload = document.querySelector('#modal-upload-form');
                            formUpload.reset();
                            i.style.opacity ='1';
                            b.style.opacity ='1';
                            p.style.opacity ='1';
                        }
                        else if (event.target.classList.contains('fa-trash')){
                            event.addEventListener('click',(event) =>{
                            if(confirm(`Voulez-vous supprimer l'élement ciblé?`)){
                                const idParent = library[index].id;
                                let elementSupp = document.querySelector(`[data-id="${idParent}"]`);
                                console.log(elementSupp);
                                console.log(`${apiUrl}works/${idParent} supprime: ${library[index].title}`);
                                const suppression = fetch (`${urlWork}/${idParent}`,{
                                    method : 'DELETE',
                                    headers : {'Authorization': `Bearer ${token}`,
                                                "Accept": "*/*"}
                                })
                                .then(suppression => suppression.ok)
                                .then(console.log('Suprression reussi !'),
                                    elementSupp.remove(),
                                    messageValidModal( document.querySelector('body'),"Suppression reussi !"),
                                    console.log(library)
                                )
                    
                            }else{return}
                        })}
                    })
                    // const inputFileImage = document.querySelector('#imgUpload');
                    // inputFileImage.addEventListener('change',(file) =>{ Affichage(file)})
                    // const editionButton = document.querySelector('#Edition-Projet');
                    // editionButton.addEventListener('click',(element) => {openModal(element); closeModal})
                    // console.log("page chargé et function activé")

            })

        }
        else {
            console.log("Pas connecté");
            return
        }
};
//************************** CARD MODAL GALLERY ******************//

const cardModalCreate = async function (element) {
    const modalGallery = document.querySelector('.modal-gallery')
    const cardGallery = document.createElement('div');
    cardGallery.classList.add('card-gallery')
    cardGallery.setAttribute('data-id',element.id)
    const cardGalleryIMG = document.createElement('img');
    cardGalleryIMG.src = element.imageUrl;
    const cardGalleryArrow = document.createElement('i');
    cardGalleryArrow.setAttribute('class', 'fa-solid fa-arrows-up-down-left-right');
    const cardGalleryTrash = document.createElement('i');
    cardGalleryTrash.setAttribute('class', 'fa-solid fa-trash-can');
    const cardGallerySpan = document.createElement('span');
    cardGallerySpan.innerText ='éditer';
    cardGallery.appendChild(cardGalleryIMG);
    cardGallery.appendChild(cardGalleryArrow);
    cardGallery.appendChild(cardGalleryTrash);
    cardGallery.appendChild(cardGallerySpan);
    modalGallery.appendChild(cardGallery);
}
// ****************** OPTION SELECT D'UPLOAD ************************//

const optionSelectCreate = async function(element){
    const optionCategory = document.createElement('option')
    optionCategory.setAttribute('value', element.id)
    optionCategory.innerText = element.name
    const selectUpload = document.querySelector('#modal-upload-category')
    selectUpload.appendChild(optionCategory)
}

const buildContent = async function (){
    library.forEach(element => {
        cardModalCreate(element)
    }),
    category.forEach((element) => {
        optionSelectCreate(element)
    })
}

init();

/**
 * Creer les boutons de filtre index.html
 * @param {object} element 
 */
function filterBouton(element){
    const btnFilterCreate = document.createElement('bouton');
    btnFilterCreate.classList.add('btn-filter');
    btnFilterCreate.setAttribute('id',`filter${element.id}`);
    btnFilterCreate.setAttribute('type','button');
    btnFilterCreate.setAttribute('name',`${element.name}`);
    btnFilterCreate.innerText = element.name
    filter.appendChild(btnFilterCreate);
};

// --------------- WORKS --------------
/**
 * Creer les elements de projet (img , alt , description et class)
 * @param {object} element 
 */
function worksCreate (element){
    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    imgElement.src = element.imageUrl;
    imgElement.alt = element.title
    figureElement.appendChild(imgElement);
    const figcaptionElement = document.createElement('figcaption');
    figcaptionElement.innerText = element.title
    figureElement.appendChild(figcaptionElement);
    gallery.appendChild(figureElement);
};




    const btnFilterObjets = document.querySelector('#filter1')
    const btnFilterAppartements = document.querySelector('#filter2')
    const btnFilterHotels = document.querySelector('#filter3')


    function suppIsActive (element){
        const filterIsActive = document.querySelector('.isActive');
        filterIsActive.classList.remove('isActive');
        element.classList.add("isActive")
    }
    /**
 * Lorsque qu'on clique sur un des bouton Filtre ça affiche que les elements ayant le meme categoryId
 */
    btnFilterTous.addEventListener('click',function() {
            gallery.innerHTML="";
            suppIsActive(btnFilterTous);
            library.forEach(async element => {
                worksCreate(element);
            });
    });
    btnFilterObjets.addEventListener('click',function() {
        const filterObject = library.filter(function(element){ 
            return element.categoryId === 1});
        suppIsActive(btnFilterObjets);
        gallery.innerHTML="";
        filterObject.forEach(element => {
            worksCreate(element);
        });
    });

    btnFilterAppartements.addEventListener('click',function() {
        const filterObject = library.filter(function(element){ 
            return element.categoryId === 2});
        suppIsActive(btnFilterAppartements);
        gallery.innerHTML="";
        filterObject.forEach(element => {
            worksCreate(element);
        });
    });

    btnFilterHotels.addEventListener('click',function() {
        const filterObject = library.filter(function(element){ 
            return element.categoryId === 3});
        suppIsActive(btnFilterHotels);
        gallery.innerHTML="";
        filterObject.forEach(element => {
            worksCreate(element);
        })
    })
//------------------------ TOKEN PRESENT -------------------//

// si window.localStorage.getItem('token') === true alors
/**
 * @param {boolean}
 * @returns True
 */
function isTokenPresent() {
    return localStorage.getItem("token") !== null;
  };


//------------------------BANNER LOG IN ----------------//
// Utile si on l'enleve de modalHtml

// function bannerLogin (element){
//     const bannerLogIn = document.createElement('div');
//     bannerLogIn.classList.add('log-in');
//     // Lien pour ouvrir Modal
//     const bannerLienMofidier = document.createElement('a');
//     bannerLienMofidier.setAttribute('class','buttonEdition js-modal-open')
//     bannerLienMofidier.setAttribute("href",'#modal-overlay')
//     bannerLienMofidier.innerHTML='<i class="fa-regular fa-pen-to-square"></i> Mode édition';
//     //Lien pour valider le changement dans projet
//     const bannerLienPublish = document.createElement('a');
//     bannerLienPublish.setAttribute('class','buttonPublish js-valid-modification');
//     bannerLienPublish.innerText="publier les changements";
//     bannerLogIn.appendChild(bannerLienMofidier);
//     bannerLogIn.appendChild(bannerLienPublish);
//     loginContainer.prepend(bannerLogIn);
// };

// ------------------------- MODAL ----------------------------//






//********************** OUVERTURE/FERMETURE/ SWITCH  MODAL *****/

 


// async function openModal (element){
//         console.log('click');
//         element.preventDefault();
//         isActive(overlay);
//         const modalWrapper = document.querySelector('.modal-wrapper');
//         isActive(modalWrapper);
//         wrapperHeightActive(modalWrapper);
//         const modalModificationContainer = document.querySelector('#modal-gallery-id');
//         isActive(modalModificationContainer);
//         const modalCtrl = document.querySelector('.modal-controleur')
//         isActive(modalCtrl);
//     }

// const closeModal = async function (){
//     const overlay = document.querySelector('#modal-overlay');
//     const modalXmark = document.querySelector('.fa-xmark');
//     overlay.addEventListener('click',(e) => {
//             allClose(e)
//     });
//     modalXmark.addEventListener('click',(e) => {
//         allClose(e)
// });
// }

// // Switch de page modal sur le bouton
// const ajoutPhotoButton = async function (){
//     document.querySelector('.modal-modification-button')
//     ajoutPhotoButton.addEventListener('click',(e) => {
//     isEdit(e);
//     resetUploadContainer();
// })}

// // Switch de page modal sur le bouton
// const modalArrow = async function (){
//     document.querySelector('.fa-arrow-left');
//     modalArrow.addEventListener('click',(e) => {
//     e.preventDefault();
//     isClose(modalArrow)
//     isClose(modalUploadContainer);
//     wrapperHeightActive(modalWrapper);
//     isActive(modalModificationContainer);
//     resetUploadContainer();
//     if(document.querySelector('.imageDisplayUploadBox')!= null){
//     document.querySelector('.imageDisplayUploadBox').remove()}
//     else{return}
// })}

const isActive = async function(e){
    e.classList.add('active')

}

// const isToggle = async function (e){
//     e.classList.toggle('active');
// }

// const allClose = async function(e){
//     if(e === input[type='submit']){e.preventDefault();}
//     isClose(modalModificationContainer);
//     isClose(modalUploadContainer);
//     isClose(modalWrapper);
//     isClose(overlay);
//     isClose(modalArrow);
//     isClose(modalXmark);
//     isClose(modalCtrl);
// }

// const isEdit = async function (e){
//     if(e.target ==ajoutPhotoButton){
//     e.preventDefault();}
//     isClose(modalModificationContainer);
//     wrapperHeightRemove(modalWrapper);
//     isActive(modalArrow);
//     isActive(modalUploadContainer);
// }

const isClose = async function (e){
    e.classList.remove('active');
}

const wrapperHeightRemove = async function (e) {
    e.classList.remove('height')
}

const wrapperHeightActive = async function (e) {
    e.classList.add('height')
}

// const resetUploadContainer = async function  () {
//     const i = document.querySelector('.fa-image');
//     const b = document.querySelector('#imgUploadLabel');
//     const p = document.querySelector('.modal-upload-condition');
//     formUpload.reset()
//     i.style.opacity ='1';
//     b.style.opacity ='1';
//     p.style.opacity ='1';
// }

//********************** UPLOAD IMAGE ********************************/

async function Affichage(){
var imageBase64
if(isTokenPresent){
        const inputFileImage = document.querySelector('#imgUpload');
        const inputImg = inputFileImage.target.files[0]
        console.log('blop');

        
function recupInputImage (inputImg) {
    if(!inputImg){ 
        messageErreurModal(modalWrapper , "Pas de fichier à upload !")
        return 
    } 
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        imageBase64 = event.target.result;
        console.log("imageBase64 :", imageBase64);
        displayImage(imageBase64, inputImg);
        return imageBase64
    };
    fileReader.readAsDataURL(inputImg)

};

function displayImage(imageBase64, file) {
    const modalUploadContainerInput = document.querySelector('.modal-upload-container');
    // Supprime img deja presente dans l'upload
    const imgExistante = modalUploadContainerInput.querySelector('img')
    if(imgExistante){
        imgExistante.remove();} 

    // Creation de l'image a afficher
    const imageDisplay = document.createElement('img');
    imageDisplay.classList.add('imageDisplayUploadBox');
    imageDisplay.src = imageBase64

    // Cache des element deriere l'image quand elle est presente
    if(imageDisplay){
    let i = document.querySelector('.fa-image').style.opacity='0';
    let b = document.querySelector('#imgUploadLabel').style.opacity='0';
    let p = document.querySelector('.modal-upload-condition').style.opacity='0';
    }
    
    modalUploadContainerInput.prepend(imageDisplay);
}

function messageErreurModal(lieu, message){
    const Span = document.createElement('span');
    Span.setAttribute('class','error modal-notification')
    Span.innerText = ` ${message} !`
    lieu.prepend(Span);
    setTimeout(() => Span.remove(), 3000)
}

function messageValidModal(lieu, message){
    const Span = document.createElement('span');
    Span.setAttribute('class','valid modal-notification')
    Span.innerText = ` ${message} !`
    lieu.prepend(Span);
    setTimeout(() => Span.remove(), 1500)
}
    }

}
//********************** SUPPRIMER ********************************/

document.classList.contains('fa-trash-can').addEventListener('click',(element)=>{
    console.log('click supp');
        if(confirm(`Voulez-vous supprimer l'élement ciblé?`)){
            const idParent = library[index].id;
            let elementSupp = document.querySelector(`[data-id="${idParent}"]`);
            console.log(elementSupp);
            console.log(`${apiUrl}works/${idParent} supprime: ${library[index].title}`);
            const suppression = fetch (`${urlWork}/${idParent}`,{
                method : 'DELETE',
                headers : {'Authorization': `Bearer ${token}`,
                            "Accept": "*/*"}
            })
            .then(suppression => suppression.ok)
            .then(console.log('Suprression reussi !'),
                elementSupp.remove(),
                messageValidModal( document.querySelector('body'),"Suppression reussi !"),
                console.log(library)
            )

        }else{return}
})

// Code original
// document.querySelectorAll('.fa-trash-can').forEach((element, index)=>{
//     element.addEventListener('click', (event) =>{
//         console.log('click supp');
//         if(confirm(`Voulez-vous supprimer l'élement ciblé?`)){
//             const idParent = library[index].id;
//             let elementSupp = document.querySelector(`[data-id="${idParent}"]`);
//             console.log(elementSupp);
//             console.log(`${apiUrl}works/${idParent} supprime: ${library[index].title}`);
//             const suppression = fetch (`${urlWork}/${idParent}`,{
//                 method : 'DELETE',
//                 headers : {'Authorization': `Bearer ${token}`,
//                             "Accept": "*/*"}
//             })
//             .then(suppression => suppression.ok)
//             .then(console.log('Suprression reussi !'),
//                 elementSupp.remove(),
//                 messageValidModal( document.querySelector('body'),"Suppression reussi !"),
//                 console.log(library)
//             )

//         }else{return}
//     });
// });

/************************* ENVOI UPLOAD ******************************/

async function submitFunction (){
const formUpload = document.querySelector('#modal-upload-form')

formUpload.addEventListener('submit', async (event) => {
    event.preventDefault();
    const inputFileTitre = document.querySelector('#modal-upload-title');
    const inputFileSelect = document.querySelector('#modal-upload-category');
    const inputFileImage = document.querySelector('#imgUpload');
    const titre = inputFileTitre.value.trim();
    const category = inputFileSelect.value;
    const myRegex = /^[a-zA-Z\s-]+$/;



    if (!myRegex.test(titre)) {
        messageErreurModal(modalWrapper, "Titre invalide");
        return;
    } else if (!inputFileImage.files[0]) {
        messageErreurModal(modalWrapper, "Image non conforme");
        return;
    }




    let formData = new FormData();

    formData.append('image', inputFileImage.files[0]);
    formData.append('title', titre);
    formData.append('category', category);
    console.log("formData :",formData);

    /**
     * Envoi du formulaire au serveur
     */
    try {
        let sendWork = await fetch(`${urlWork}`, {
            method: 'POST',
            body: formData,
            headers: { "Accept": "application/json;  charset=utf-8",
                "Authorization": `Bearer ${token}`
            }
        });


        if (sendWork.ok) {
            console.log("Envoi réussi!");
            messageValidModal(modalWrapper, "Envoi réussi !");
            console.log(library);
        } else {
            messageErreurModal(modalWrapper, "Envoi refusé !")
            console.log("Échec de l'envoi !");
        }
    } 
    catch (error) {
            console.log("Erreur accès serveur");
            messageErreurModal(modalWrapper, "Impossible d'accéder au serveur");
    }
});
}
