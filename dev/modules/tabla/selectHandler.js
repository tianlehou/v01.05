export const handleSelectChange = () => {
  const selectElements = document.querySelectorAll(".pay-select");
  selectElements.forEach((selectElement) => {
    const updateSelectState = (element) => {
      const selectedValue = element.value;
      if (selectedValue === "12.00") {
        element.disabled = true;
        element.parentNode.previousElementSibling.style.color = "green";
        element.parentNode.previousElementSibling.style.fontWeight = "bold";
      } else {
        element.disabled = false;
        element.parentNode.previousElementSibling.style.color = "black";
        element.parentNode.previousElementSibling.style.fontWeight = "normal";
      }
    };

    // Al cargar la página
    updateSelectState(selectElement);

    // Al cambiar el valor del select
    selectElement.addEventListener("change", function () {
      updateSelectState(this);
    });
  });
};
