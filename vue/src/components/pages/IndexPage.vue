<template>
  <div v-if='!gameOver' class="app">
    <GameBoard />
    <SidePanel />
  </div>

    <div v-else class="game-over">
        <div>Вы проиграли</div>
        <button class="game-over-button" @click="() => restart()">Заново</button>
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

.game-over {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  font-size: 25px;
}

.game-over-button {
  border: 1px;
  border-radius: 5px;
  background: #579840;
  font-size: 20px;
  cursor: pointer;
}

.game-over-button:hover {
  background: #025a12
}


</style>