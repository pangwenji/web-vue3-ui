import contextmenu from "./components/contextmenu.vue"
import contextmenuItem from "./components/contextmenuItem.vue"
import { isRef } from "vue"


const mounted = (el, binding)=>{
    const contextmenuKey = binding.arg;
    const options = binding.value;
    if (!contextmenuKey) {
        console.error("参数有误");
        return;
    }
    const contextmenuRef = isRef(contextmenuKey) ? contextmenuKey.value : binding.instance?.$refs[contextmenuKey];
    if (!contextmenuRef) {
        console.error(`没有找到 ${contextmenuKey} 对应的实例`);
        return;
    }
    if(options&&options.index>=0 &&Array.isArray(contextmenuRef)){
        const contextmenuRefItem = contextmenuRef[options.index]
        if (!contextmenuRefItem) {
            console.error(`没有找到 ${contextmenuKey} 对应的实例`);
            return;
        }
        if (typeof contextmenuRefItem.addReference !== "function") {
            console.error(`${contextmenuKey} 对应的实例不是 VContextmenu`);
            return;
        }
        el.$contextmenuKey = contextmenuKey;
        contextmenuRefItem.addReference(el,options);
    }else{
        if (typeof contextmenuRef.addReference !== "function") {

            console.error(`${contextmenuKey} 对应的实例不是 VContextmenu`);
            return;
        }
        el.$contextmenuKey = contextmenuKey;
        contextmenuRef.addReference(el,options);
    }
};

const unmounted = ( el, binding ) => {
    const contextmenuKey = binding.arg;
    const options = binding.value;
    if (!contextmenuKey) return;
    const contextmenuRef = binding.instance?.$refs[contextmenuKey];
    if(options&&options.index>=0 && Array.isArray(contextmenuRef)){
        const contextmenuRefItem = contextmenuRef[options.index]
        contextmenuRefItem?.removeReference(el,options);
        return
    }
    contextmenuRef?.removeReference(el,options);
};

const directive = {
    mounted,
    unmounted,
}
const install = (vue)=>{
    vue.directive('contextmenu',directive);
    vue.component(contextmenu.name,contextmenu)
    vue.component(contextmenuItem.name,contextmenuItem)
}
const vContextmenu = {
    install,
}
export default vContextmenu