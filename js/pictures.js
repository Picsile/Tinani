
// Отображение
let picturesData = [];

document.addEventListener("DOMContentLoaded", async () => {
    // Получение данных о картинах
    try {
        const response = await fetch("./assets/pictures.json");
        picturesData = await response.json();
    } catch (e) {
        console.log(e);
    }
    pictureRender();
});

function pictureRender(filters = {}) {
    let picturesDataSort = [...picturesData];

    // Фильтрация
    for (const key in filters) {
        
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
            const value = filters[key];
            
            if (key !== 'sort') {
                if (value) {
                    picturesDataSort = picturesDataSort.filter((picture) => {
                        const pictureValue = picture.metadata[key];
            
                        if (!Array.isArray(pictureValue)) {
                            return String(pictureValue) === value; 
                        } else {
                            return pictureValue.indexOf(value) !== -1;
                        }
                    });
                }
            } else {
                
                switch (value) {
                    case 'firstOld': picturesDataSort.sort((a, b) => new Date(a.date) > new Date(b.date) ? 1 : -1);
                        break;
                    case 'firstCheap': picturesDataSort.sort((a, b) => a.price > b.price ? 1 : -1);
                        break;
                    case 'firstExpensive': picturesDataSort.sort((a, b) => a.price > b.price ? -1 : 1);
                        break;
                        default:
                            break;
                }
            }
        }
    }

    const picturesListElem = document.getElementById('pictures-list');   

    if (picturesDataSort.length) {
        picturesListElem.classList.add('grid', 'grid-cols-3');
        picturesListElem.innerHTML = picturesDataSort.map(
            (picture) =>
                `<div class="picture flex flex-col opacity-0 translate-y-5" 
                    data-picture='${JSON.stringify(picture)}' style="transition: 0.5s"   
                >
                    <div class="overflow-hidden aspect-[9/11] cursor-pointer">
                        <img
                            src="${picture.imageUrlMain}"
                            alt="${picture.title}"
                            class="w-full h-full object-cover rounded hover:opacity-70 transition-all"
                            style="will-change: transform"
                        />
                    </div>
                    <h3 class="font-tinos font- text-2xl pt-2">${picture.title}</h3>
                    <span class="text-gray-600 pt-1.5">Размер: ${picture.metadata.size}</span>
                    <span class="font-ibm-regular text-xl pt-3.5 pb-3">${picture.price} $</span>
                    <button 
                        class="bg-slate-950 text-xl text-white py-2 border rounded-lg hover:bg-gray-200 hover:text-black hover:shadow-sm transition-all"
                    >
                        Заказать
                    </button>
                 </div>`
            ).join("");
    } else {
        picturesListElem.classList.remove('grid', 'grid-cols-3');
        picturesListElem.innerHTML = 
        `<div class="nothingFound picture flex justify-center items-center w-full h-80 border border-slate-300 opacity-0 translate-y-5" style="transition: 0.5s">
            <span class="font-montserrat text-lg text-slate-600">Ничего не найдено</span>
        </div>`
    }

    // Навешиваем события
    const picturesElem = document.querySelectorAll(".picture");

    picturesElem.forEach((picture, index) => {
        if (!picture.classList.contains('nothingFound')) {
            picture.addEventListener("click", () => {
                openPicture(JSON.parse(picture.dataset.picture));
            });
        }

        const positionInRow = index % 3;
        const delay = 100 + positionInRow * 100;
        
        setTimeout(() => {
            picture.classList.remove("opacity-0", "translate-y-5");
        }, delay);
    });
}



// Применить фильтрацию
function updateRender() {
    const filters = {
        availability: null,
        style: null,
        sizeType: null,
        atmosphere: null,
        sort: null,
    };

    filterElems.forEach((selectElem) => {
        if (selectElem.selectedIndex) {
            filters[selectElem.dataset.selectName] = selectElem.value;
        }
    });

    pictureRender(filters);
}



// Модалка
const modalPictureElem = document.getElementById("modal-picture");
const modalPictureContentElem = document.getElementById("modal-picture__content");

function openPicture(pictureData) {
    document.body.classList.add("overflow-hidden");
    modalPictureElem.classList.remove("opacity-40");
    modalPictureElem.classList.add("translate-x-[100vw]");

    modalPictureContentElem.innerHTML = `
                    <!-- Визуальная часть -->
                    <div class="flex flex-col gap-2 w-[32vw]">
                        <div class="overflow-hidden aspect-[1/1]">
                            <img
                                class="w-full h-full object-cover"
                                src="${pictureData.imageUrlMain}"
                                alt="Дядя Скрудж"
                            />
                        </div>

                        <!-- Больше фото -->
                        <div class="grid grid-cols-6 gap-2">
                            ${
                                pictureData.imageUrlDop.length
                                    ? `<div class="overflow-hidden aspect-square cursor-pointer hover:opacity-50 transition-all">
                                                            <img
                                                                class="w-full h-full object-cover"
                                                                src="${pictureData.imageUrlMain}"
                                                                alt="${pictureData.title}"
                                                            />
                                                        </div>` +
                                      pictureData.imageUrlDop
                                          .map(
                                              (imgDopHtml) =>
                                                  `<div class="overflow-hidden aspect-square cursor-pointer hover:opacity-50 transition-all">
                                                            <img
                                                                class="w-full h-full object-cover"
                                                                src="${imgDopHtml}"
                                                                alt="${pictureData.title}"
                                                            />
                                                        </div>`
                                          )
                                          .join("")
                                    : ""
                            }
                        </div>
                    </div>

                    <!-- Текстовая часть -->
                    <div class="flex flex-col justify-between w-[32vw] h-[32vw]">
                        <!-- Заголовок -->
                        <div class="flex flex-col gap-4 font-ibm-regular mt-[-10px] mb-9">
                            <h1 class="tracking-wider text-4xl">${pictureData.title}</h1>
                            <span class="text-3xl">${pictureData.price} $</span>
                        </div>

                        <!-- Описание -->
                        <div class="flex flex-col gap-3.5 font-montserrat mb-9">
                            <h2 class="font-bold text-xl">Подробнее о работе</h2>
                            <p class="leading-[30px] text-lg">${pictureData.description}</p>
                        </div>

                        <!-- Данные -->
                        <ul class="flex flex-col gap-3 font-montserrat  mb-9">
                            <li class="flex gap-4">
                                <span>Наличие:</span>
                                <span>${
                                    pictureData.metadata.availability
                                        ? "В наличии"
                                        : "Нет в наличии"
                                } </span>
                            </li>
                            <li class="flex gap-4">
                                <span>Стиль:</span>
                                <span>${pictureData.metadata.style}</span>
                            </li>
                            <li class="flex gap-4">
                                <span>Размер:</span>
                                <span>${pictureData.metadata.size}</span>
                            </li>
                            <li class="flex gap-4">
                                <span>Атмосфера:</span>
                                ${pictureData.metadata.atmosphere
                                    .map(
                                        (tag) => `
                                    <div
                                        class="flex items-center text-sm px-3 border rounded-md border-slate-950"
                                    >
                                        ${tag}
                                    </div>
                                    `
                                    )
                                    .join("")}
                            </li>
                        </ul>

                        <button
                            class="max-w-fit bg-black text-xl text-white p-2.5 px-28 rounded-lg hover:bg-gray-200 hover:text-black hover:shadow-sm transition-all"
                        >
                            <a href="https://t.me/sufrazhistka" target="_blank" rel="noopener noreferrer">Заказать</a>
                        </button>
                    </div>`;
}

function closePicture() {
    document.body.classList.remove("overflow-hidden");
    modalPictureElem.classList.add("opacity-40");
    modalPictureElem.classList.remove("translate-x-[100vw]");
}

document.getElementById("modal-picture__close").addEventListener("click", () => {
    closePicture();
});
