Vue.component('world-panel',
  {
    props: {
      world: Object,
      width: String,
      height: String
    },
    data() {
      return {
        refName: '',
        plLabel: 'start',
        paused: true,
        window: null
      }
    },
    destroyed() {
      console.log('destroyed');
    },
    beforeMount() {
      console.log(`before mount-${this.world.name}`);
      this.refName = `canvas-${this.world.name}`;
    },
    async mounted() {
      console.log(`mounted-${this.world.name}`);
      this.$emit('created', this.$refs[this.refName]);
    },
    created() {
      console.log(`created-${this.world.name}`);
    },
    methods: {
      pauseOrResume() {
        this.paused = !this.paused;
        this.plLabel = this.paused ? 'Resume' : 'Pause';
        this.$emit('pause-or-resume');
      }
    },
    template: `
    <v-card color="light-blue lighten-4 mx-auto">
      <v-toolbar flat color="rgba(0, 0, 0, 0)">
        <v-card-title class="pa-0">{{world.name}}</v-card-title>
        <v-spacer></v-spacer>
        <v-btn text icon class="ml-auto" @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="my-0 py-0">
      <v-row my="0" py="0" class="d-flex justify-center">
        <v-col mx="0" px="0" cols="12" lg="auto" md="auto" sm="auto" class="d-flex align-end">
          <div style="overflow: auto">
            <canvas :ref="refName" :width="width" :height="height" class="grey"></canvas>
          </div>
        </v-col>
        <v-col mx="0" px="0" cols="8" lg="1" md="1" sm="auto" mr="auto" class="d-flex align-center">
          <v-row no-gutters> <!--class="d-flex flex-row flex-lg-column flex-md-column flex-sm-column">-->
            <v-col class="d-flex justify-center">
              <v-btn min-width="95" text color="light-blue" @click="pauseOrResume">{{plLabel}}</v-btn>
            </v-col>
            <v-col class="d-flex justify-center">
              <v-btn min-width="95" text color="light-blue" :disabled="!paused" @click="$emit('step')">step</v-btn>
            </v-col>
            <v-col class="d-flex justify-center">
              <v-btn min-width="95" text color="light-blue" :disabled="!paused" @click="$emit('reset')">reset</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      </v-card-text>
    </v-card>
    `
  })