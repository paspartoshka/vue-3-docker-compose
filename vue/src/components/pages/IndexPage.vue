<template>
  <div class="app">
    <GameBoard />
    <SidePanel />

    <div v-if="gameOver" class="overlay">
      <div>
        <div>Вы проиграли</div>
        <button @click="() => restart()">Заново</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import GameBoard from '@/components/ui/GameBoard.vue'
import SidePanel from '@/components/ui/SidePanel.vue'

export default {
  name: 'IndexPage',
  components: {
    GameBoard,
    SidePanel
  },

  computed: {
    ...mapGetters(['gameOver']),
  },

  methods: {
    ...mapActions(['selectLevel']),

    restart() {
      this.selectLevel(this.$store.state.level)
    },
  },
}
</script>

<style>
.app {
  display: flex;
}

.overlay {
  position: fixed;
  inset: 0;
  background: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay button {
  padding: 10px 34px;
  background: #09121e;
  border: 1px solid #22262b;
  border-radius: 5px;
  color: #e8eaf0;
  cursor: pointer;
  text-align: left;
  font-size: 10px;
}

.overlay button:hover:not(:disabled) { background: #59646c}


</style>