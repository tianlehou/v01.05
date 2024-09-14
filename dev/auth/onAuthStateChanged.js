firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      const userUID = user.uid;
      
      // Obtener el rol del usuario desde la base de datos
      const usuarioRef = firebase.database().ref('usuarios/' + userUID);
      
      usuarioRef.once('value').then(function(snapshot) {
        const rol = snapshot.val().rol;
        
        if (rol === 'admin') {
          // Si el usuario es admin, cargar todos los pagos
          cargarTodosLosPagos();
        } else {
          // Si es un usuario normal, cargar solo sus pagos
          cargarPagosUsuario(userUID);
        }
      });
    } else {
      // Redirigir al login si no está autenticado
      window.location.href = "login.html";
    }
  });-
  
  function cargarPagosUsuario(userUID) {
    const pagosRef = firebase.database().ref('pagos/' + userUID);
    
    pagosRef.once('value').then(function(snapshot) {
      const pagos = snapshot.val();
      mostrarPagosEnTabla(pagos);
    });
  }
  
  function cargarTodosLosPagos() {
    const pagosRef = firebase.database().ref('pagos');
    
    pagosRef.once('value').then(function(snapshot) {
      const todosLosPagos = snapshot.val();
      
      for (const usuarioUID in todosLosPagos) {
        const pagosUsuario = todosLosPagos[usuarioUID];
        mostrarPagosEnTabla(pagosUsuario, usuarioUID); // Pasar también el UID del usuario
      }
    });
  }
  
  function mostrarPagosEnTabla(pagos, usuarioUID) {
    const tabla = document.getElementById('tabla-pagos');
    
    for (const mes in pagos) {
      const fila = document.createElement('tr');
      
      if (usuarioUID) {
        const columnaUsuario = document.createElement('td');
        columnaUsuario.textContent = usuarioUID; // Muestra el UID o nombre del usuario
        fila.appendChild(columnaUsuario);
      }
      
      const columnaMes = document.createElement('td');
      columnaMes.textContent = mes;
      
      const columnaRenta = document.createElement('td');
      columnaRenta.textContent = pagos[mes].renta;
      
      const columnaFecha = document.createElement('td');
      columnaFecha.textContent = pagos[mes].fechaPago;
      
      fila.appendChild(columnaMes);
      fila.appendChild(columnaRenta);
      fila.appendChild(columnaFecha);
      tabla.appendChild(fila);
    }
  }
  