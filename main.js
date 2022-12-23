const { createApp } = Vue;

createApp({
  data() {
    return {
      events: [],
      backupEvents: [],
      categoriasFiltradas: [],
      categorias: [],
      textoInput: "",
      id: "",
      evento: {},
      statistics: {
        evento1: "",
        evento2: "",
        evento3: "",
        upcoming: [],
        past: [],
      },
    };
  },
  created() {
   this.loadData()
  },

  methods: {
    loadData(){
      fetch("https://mindhub-xj03.onrender.com/api/amazing")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.events = this.filterDate(data.events,data.currentDate);
        this.backupEvents = this.events;
        console.log(data.events);
        this.obtenerCategorias();
        let params = new URLSearchParams(location.search);
        this.id = params.get("id");
        if (this.id != "") {
          this.evento = this.events.find((evento) => evento._id == this.id);
        }
        this.getStatistics()
      })
      .catch((err) => console.log(err)); 
    },
    obtenerCategorias() {
      this.categorias = [...new Set(this.events.map(event => event.category))];
    },
    filterDate(events, date) {
      let page = document.getElementById('page').textContent
      if (page == 'Upcoming') {
          return events.filter(event => event.date >= date)
      } else if (page == 'Past') {
          return events.filter(event => event.date < date)
      }
      return events
  },
  getStatistics(){
    // ordenar y sacar el primer y el ultimo elemento  let array = [1,2,3,4,5]
    // console.log(array[0],array[array.length-1])
    this.events.sort((a,b)=>(b.assistance*100)/b.capacity - (a.assistance*100)/a.capacity)
    this.statistics.evento1 = this.events[0].name
    this.statistics.evento2 = this.events[this.events.length-1].name
    this.events.sort((a,b)=>b.capacity - a.capacity)
    this.statistics.evento3 = this.events[0].name
    // separar por eventos futuros y pasados
    // con los futuros, recorrer, generar array de categorias, y por cada categoria generar un objeto
    // por cada categoria recorrer nuevamente el array, en este caso futuros, y hacer los calculos pertinentes (sumatorias etc)
    // lo mismo con pasados
}

   
  },
  computed: {
    superFiltro() {
      let primerFiltro = this.backupEvents.filter(evento => evento.name.toLowerCase().includes(this. textoInput.toLowerCase()))
      this.events = (this.categoriasFiltradas.length > 0) ? primerFiltro.filter(evento => this.categoriasFiltradas.includes(evento.category)) : primerFiltro
  }
  },
}).mount("#app");
