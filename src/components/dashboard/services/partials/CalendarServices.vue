<template>
  <div class="is-light-mode">
    <Qalendar style="height: 520px" class="is-light-mode" @updated-mode="filterByPeriod" @updated-period="filterByPeriod"
      :events="events" :config="config" />
  </div>
</template>

<script setup>
// imports
import { Qalendar } from "qalendar";

// references
const events = [
  {
    title: "Advanced algebra",
    with: "Chandler Bing",
    time: { start: "2025-02-16 12:05", end: "2025-02-16 13:35" },
    color: "yellow",
    isEditable: true,
    id: "753944708f0f",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!"
  },
  {
    title: "Ralph on holiday",
    with: "Rachel Greene",
    time: { start: "2025-02-18 13:05", end: "2025-02-18 14:05" },
    color: "green",
    isEditable: true,
    id: "5602b6f589fc"
  }
  // ...
]

const config = {
}

// methods
const filterByPeriod = (e) => {
  console.log(e)
}
</script>

<style>
@import "qalendar/dist/style.css";
</style>
