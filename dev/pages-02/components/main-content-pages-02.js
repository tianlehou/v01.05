// main-content-pages-02.js
function loadHTMLmaincontent() {
    const bodyContent = `
  <!-- Main Content -->
  <main class="main-content">
    <!-- Main Content - Container -->
    <div class="main-container">
      <table id="miTabla" class="table table-striped">
        <!-- Table - Head -->
        <thead>
          <tr>
          <th class="text-center" id="headerTabla">Nombre</th>
            <th class="text-center">#</th>
            <th class="text-center">1</th>
            <th class="text-center">2</th>
            <th class="text-center">3</th>
            <th class="text-center">4</th>
            <th class="text-center">5</th>
            <th class="text-center">6</th>
            <th class="text-center">7</th>
            <th class="text-center">8</th>
            <th class="text-center">9</th>
            <th class="text-center">10</th>
            <th class="text-center">11</th>
            <th class="text-center">12</th>
            <th class="text-center">13</th>
            <th class="text-center">14</th>
            <th class="text-center">15</th>
            <th class="text-center">16</th>
            <th class="text-center">17</th>
            <th class="text-center">18</th>
            <th class="text-center">19</th>
            <th class="text-center">20</th>
            <th class="text-center">21</th>
            <th class="text-center">22</th>
            <th class="text-center">23</th>
            <th class="text-center">24</th>
            <th class="text-center">25</th>
            <th class="text-center">26</th>
            <th class="text-center">27</th>
            <th class="text-center">28</th>
            <th class="text-center">29</th>
            <th class="text-center">30</th>
            <th class="text-center">31</th>
            <th>Acciones</th>
            <th class="text-center">userId</th>
          </tr>
        </thead>

        <!--  Dinamic Table - Body -->
        <tbody class="table-body" id="contenidoTabla">
          <!-- aqui va el contenido d la tabla -->
        </tbody>
      </table>
    </div>
  </main>
    `;
  
    const bodyElement = document.createElement('div');
    bodyElement.innerHTML = bodyContent;
    document.getElementById('main-content-pages-02-container').appendChild(bodyElement);
  }
  
  // Ejecutar la función para cargar el contenido del head
  loadHTMLmaincontent();
  