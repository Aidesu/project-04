import { onBeforeUnmount, ref, watch, type Ref } from "vue";

/** Copie d'une ref mise à jour seulement après `delay` ms sans changement */
export function useDebounced<T>(source: Ref<T>, delay = 300): Ref<T> {
    const debounced = ref(source.value) as Ref<T>;
    let timer: ReturnType<typeof setTimeout> | undefined;

    watch(source, (value) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            debounced.value = value;
        }, delay);
    });

    onBeforeUnmount(() => clearTimeout(timer));

    return debounced;
}
