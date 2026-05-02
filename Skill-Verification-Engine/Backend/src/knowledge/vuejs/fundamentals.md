Vue.js is a progressive JavaScript framework for building user interfaces.

Vue uses a component-based architecture. Single-File Components (.vue) contain template, script, and style.

The Options API defines components with data(), methods, computed, watch, and lifecycle hooks.

The Composition API (Vue 3) uses setup() function or <script setup> with ref, reactive, computed, watch.

ref() creates reactive primitive values: const count = ref(0); accessed via count.value in script.

reactive() creates reactive objects: const state = reactive({ count: 0 }); no .value needed.

computed() creates derived reactive values: const double = computed(() => count.value * 2).

watch() observes reactive sources: watch(count, (newVal, oldVal) => { }).

watchEffect() runs immediately and re-runs when dependencies change.

Template directives: v-bind (:), v-on (@), v-if, v-else, v-for, v-model, v-show, v-slot.

v-model provides two-way data binding on form inputs.

v-for renders lists: <li v-for="item in items" :key="item.id">{{ item.name }}</li>.

Props pass data down: defineProps({ title: String }). Events emit data up: emit('update', value).

Lifecycle hooks: onMounted, onUpdated, onUnmounted (Composition API) or mounted, updated, beforeUnmount (Options API).

Vue Router provides client-side routing: createRouter with createWebHistory or createWebHashHistory.

Dynamic routes: { path: '/user/:id', component: UserView }. Accessed via useRoute().params.id.

Navigation guards: beforeEach, beforeResolve, afterEach for route protection.

Pinia is the recommended state management library (successor to Vuex): defineStore with state, getters, actions.

Vuex uses a centralized store with state, getters, mutations, and actions.

Slots allow parent components to inject content: <slot>, named slots, scoped slots.

Teleport renders content to a different DOM location: <Teleport to="#modal-root">.

Provide/Inject passes data through the component tree without prop drilling.
