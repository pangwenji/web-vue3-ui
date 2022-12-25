<script>
import {ref, h, watch} from 'vue';
export default {
    props:{
        data:{
            type:Array,
            default(){
                return [];
            }
        }
    },
    setup(prop,{emit}){
        const vnode = ref([]);
        const handleClickItem = (item)=>{
            item.show = !item.show;
        }
        const renderItem = (data,level)=>{
            level = level ? level + 1 : 1;
            data.forEach((item)=>{
                const node = h('div',{ onClick:handleClickItem(item) },item.title);
                vnode.value.push(node);
                if(item.children && item.children.length > 0 && item.show){
                    renderItem(item.children, level);
                }
            })
        }
        watch(()=>prop.data,(n)=>{
            vnode.value = [];
            renderItem(n);
        },{immediate: true})
        return () => {
            return h('div',{},vnode.value);
        }
    }
}
</script>
<style scoped>

</style>