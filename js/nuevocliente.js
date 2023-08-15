(function(){
    let DB;
    const formulario = document.querySelector('#formulario')

    document.addEventListener('DOMContentLoaded',()=>{
        
        conectarDB();

        formulario.addEventListener('submit',validarCliente)

    });  

    function validarCliente(e) {
        e.preventDefault();

        //leer todo los input
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('todos los campos son obligatorios', 'error')

            return;
        }

        // crear un objeto con la info 

        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
        }


        cliente.id = Date.now();

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');
        
        objectStore.add(cliente);

        transaction.onerror = ()=>{
            imprimirAlerta('El correo ya esta registrado', 'error')
        };

        transaction.oncomplete = ()=>{
            imprimirAlerta('El cliente se agrego correctamente')

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 3000);
        }
    }
})();