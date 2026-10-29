<template>
  <RouterView v-slot="{ Component }">
    <Transition name="alpha-fade">
      <Component :is="Component" />
    </Transition>
  </RouterView>
</template>
