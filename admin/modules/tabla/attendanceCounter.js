export function updateAttendanceCounter(row) {
    const days = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    let counter = 0;

    days.forEach(day => {
        const selectElement = row.querySelector(`select[data-field="${day}"]`);
        if (selectElement && selectElement.value === "12.00") {
            counter++;
        }
    });

    const attendanceCell = row.querySelector('.attendance-cell');
    if (attendanceCell) {
        if (counter === 6) {
            attendanceCell.textContent = "Completo";
            attendanceCell.style.color = 'green';
            attendanceCell.style.fontWeight = 'bold';
        } else if (counter === 0) {
            attendanceCell.textContent = "0/6";
            attendanceCell.style.color = 'red';
            attendanceCell.style.fontWeight = 'bold';
        } else if (counter >= 1 && counter <= 5) {
            attendanceCell.textContent = `${counter}/6`;
            attendanceCell.style.color = 'orange';
            attendanceCell.style.fontWeight = 'bold';
        } else {
            attendanceCell.textContent = `${counter}/6`;
            attendanceCell.style.color = '';
            attendanceCell.style.fontWeight = '';
        }
    }
}
