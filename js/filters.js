const filterElems = document.getElementById('filters').querySelectorAll('select');

filterElems.forEach(selectElem => {
    selectElem.addEventListener('change', () => {
        if (selectElem.selectedIndex) {
            selectElem.classList.add('bg-slate-100');
            selectElem.classList.add('shadow-inner');
        } else {
            selectElem.classList.remove('bg-slate-100');
            selectElem.classList.remove('shadow-inner');
        }

        updateRender();
    });
});

document.getElementById('removeFilters').addEventListener('click', () => {
    filterElems.forEach(selectElem => {
       selectElem.selectedIndex = 0;
       selectElem.classList.remove('bg-slate-100');
       selectElem.classList.remove('shadow-inner');
    });

    updateRender();
})