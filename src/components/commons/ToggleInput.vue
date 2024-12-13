<template>
  <div class="toggle" :class="{ active: isActive, 'small': size === 'sm', 'large': size === 'lg' }" @click="toggle">
    <div class="toggle-bg"></div>
    <div class="toggle-indicator"></div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "ToggleButton",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "lg",
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isActive = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const toggle = () => {
      isActive.value = !isActive.value;
    };

    return { isActive, toggle };
  },
});
</script>

<style scoped lang="scss">
.toggle {
  width: 60px;
  height: 30px;
  background-color: #FCD9DB;
  border-radius: 0px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle .toggle-indicator {
  width: 22px;
  height: 22px;
  background-color: white;
  border-radius: 0px;
  position: absolute;
  transition: all 0.3s ease;
  left: 7px;
}

.toggle.active {
  background-color: #ED1C24;
}

.toggle.active .toggle-indicator {
  left: 32px;
}

.small {
  width: 40px;
  height: 20px;

  .toggle-indicator {
    width: 15px;
    height: 15px;
    background-color: white;
    border-radius: 0px;
    position: absolute;
    transition: all 0.3s ease;
    left: 3px;
  }
}

.small.active {
  .toggle-indicator {
    left: 22px !important;
  }
}
</style>