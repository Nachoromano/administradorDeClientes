(function(){
let DB;
let idCliente;

const nombreinput = document.querySelector('#nombre');
const emailinput = document.querySelector('#email');
const telefonoinput = document.querySelector('#telefono');
const empresainput = document.querySelector('#empresa');

const formulario = document.querySelector('#formulario')

    document.addEventListener('DOMContentLoaded',()=>{
        ///conectar DB
        conectarDB();


        //Actualiza el registro 
        formulario.addEventListener('submit',actualizarCliente)

        //verificar el Id de la url
        const parametrosURL = new URLSearchParams(window.location.search); //primero lee lo q es la URL queystring , en caso de que haya uno va a mandar a llamar a la funcion de obtenercliente
        idCliente = parametrosURL.get('id')
        if(idCliente){
            setTimeout(() => {
                obtetenerCliente(idCliente);
            }, 100);
        }
    })

    function actualizarCliente(e){
        e.preventDefault();

        if(nombreinput.value === '' || emailinput.value === '' || telefonoinput.value === '' || empresainput.value === ''){
            imprimirAlerta('todo los campos son obligatorios','error');
            return;
        }

        //actualizar cliente

        const clienteActualizado = {
            nombre : nombreinput.value,
            email : emailinput.value,
            telefono : telefonoinput.value,
            empresa : empresainput.value,
            id: Number(idCliente) // si o si hay q pasarlo a number pq sino lo pasa en string y si esta en string cuando buquemos el id para cambiar los datos del cliente no los va a encontrar.
        }

        //esto lo q va hacer es encontrar en nuestra base de datos el id y como en nuestra base de datos le pasamos keyPath como id , va a actualizar los datos
        const transaction = DB.transaction(['crm'],'readwrite')
        const objectStore = transaction.objectStore('crm')

        objectStore.put(clienteActualizado)

        transaction.oncomplete = ()=>{
            imprimirAlerta('editado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html'
            },1000 );
        }

        transaction.onerror = (error)=>{
            console.log(error);
            imprimirAlerta('hubo un error','error')
        }
    }

    function obtetenerCliente (id){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm')
        
        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e){
            const cursor = e.target.result;

            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }

    function llenarFormulario(datoscliente){
        const {nombre,email,telefono,empresa} = datoscliente;

        nombreinput.value = nombre;
        emailinput.value = email;
        telefonoinput.value = telefono;
        empresainput.value = empresa;
    }

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm',1);

        abrirConexion.onerror = function (){
            console.log('hubo un error');
        };

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        }
    }

})();