
const app = Vue.createApp({})

app.component('calculator-app', {
    data() {
        return {
            samples: [],
            baseLayoutCost: 1800,
            extraBlockCost: 500,
            extraLayoutCost: 500,
            baseInnerTime: 4,
            extraInnerTime: 2,
            baseOutTime: 7,
            extraOutTime: 3,
            totalCost: 0,
            totalInnerTime: 0,
            totalOutTime: 0,
        }
    },
    methods: {
        addSample() {
            this.samples.push({
                id: this.samples.length,
                nameLayout: '',
                countBlock: 0,
                isPCLayout: false,
                isTabletLayout: false,
                isSmartLayout: false,
                extraLayout: [],
                outTimeResult: 0,
                innerTimeResult: 0,
                resultCost: 0,
                isNewLayout: false,
                newTitleLayout: '',
            })
        },
        removeSample(id) {
            this.samples = this.samples.filter(item => item.id != id);
        },
        addNewLayout(id){

            let sample = this.samples.find(item => item.id === id);

            if (sample.newTitleLayout.length < 3) {
                return false;
            }

            sample.extraLayout.push({
                id: sample.extraLayout.length,
                titleLayout: sample.newTitleLayout,
                isChecked: false
            });

            sample.isNewLayout = !sample.isNewLayout;
            sample.newTitleLayout = '';
        },
        createNewLayout(id) {

            let sample = this.samples.find(item => item.id === id);
            sample.isNewLayout = !sample.isNewLayout;
            sample.newTitleLayout = '';
        }
    },
    watch: {
        samples: {
            deep: true,
            handler() {
                this.samples.forEach(item => {
                    if (item.countBlock < 1) {
                        item.countBlock = 0;
                    }
                })
                this.totalCost      = 0;
                this.totalInnerTime = 0;
                this.totalOutTime   = 0;

                for (let i = 0; i < this.samples.length; i++) {
                    let item = this.samples[i];
                    let countLayout =  item.isPCLayout + item.isTabletLayout + item.isSmartLayout;

                    if(item.extraLayout.length) {
                        item.extraLayout.forEach(layout => {
                            countLayout += layout.isChecked;
                        })
                    }

                    if (countLayout < 1 || item.countBlock < 1) {
                        item.result = 0;
                        item.innerTime = 0;
                        item.outTime = 0;
                        continue;
                    }

                    let costFirstLayout = this.baseLayoutCost;
                    let costRestLayout = (countLayout - 1) * this.extraLayoutCost;
                    let costRestBlocks = (item.countBlock - 1) * this.extraBlockCost;

                    item.resultCost = costFirstLayout + costRestLayout + costRestBlocks;
                    this.totalCost += item.resultCost;

                    let innerTimeFirstLayout = this.baseInnerTime;
                    let innerTimeRestLayout = (countLayout - 1) * this.extraInnerTime;

                    item.innerTimeResult = innerTimeFirstLayout + innerTimeRestLayout;
                    this.totalInnerTime += item.innerTimeResult;

                    let outTimeFirstLayout = this.baseOutTime;
                    let outTimeRestLayout = (countLayout - 1) * this.extraOutTime;

                    item.outTimeResult = outTimeFirstLayout + outTimeRestLayout;
                    this.totalOutTime += item.outTimeResult;
                }
            }
        }
    },
    template: `
    <div class="calculator-app">
    
        <div class="cards-wrapper">
            <div 
                class="card" 
                v-for="sample in samples" 
                :key="sample.id"
            >
                <div class="control-card-wrapper">
                    <div class="input-group mb-1">
                        <label class="input-group-text" for="layoutName">???????????????? ????????????????</label>
                        <input type="text" name="layoutName" v-model="sample.nameLayout"  class="form-control">
                    </div>
                    <div class="input-group mb-1">
                        <label class="input-group-text" for="countBlocks">???????????????????? ????????????</label>
                        <div class="control-input-wrapper">
                            <input name="countBlocks" type="text" v-model.number="sample.countBlock"  class="form-control">
                            <div class="btn btn-outline-secondary btn-warning" @click="sample.countBlock--">-</div>
                            <div class="btn btn-outline-secondary btn-warning" @click="sample.countBlock++">+</div>
                        </div>

                    </div>
                    
                    <div class="form-check form-switch mb-1 d-flex justify-content-between">
                        <input role="switch" type="checkbox" :id="'pcLayout-' + sample.id" class="form-check-input" name="pcLayout" v-model="sample.isPCLayout" autocomplete="off">
                        <label class="form-check-label" :for="'pcLayout-' + sample.id">?????????? ??????  ???? ?</label>      
                    </div>
                    
                                       
                    <div class="form-check form-switch mb-1 d-flex justify-content-between">
                        <input role="switch" type="checkbox" :id="'tabletLayout-' + sample.id" class="form-check-input" name="tabletLayout" v-model="sample.isTabletLayout" autocomplete="off">
                        <label class="form-check-label" :for="'tabletLayout-' + sample.id">?????????? ?????? ???????????????? ?</label>      
                    </div>
                    
                    <div class="form-check form-switch mb-1 d-flex justify-content-between">
                        <input role="switch" type="checkbox" :id="'smartLayout-' + sample.id" class="form-check-input" name="smartLayout" v-model="sample.isSmartLayout" autocomplete="off">
                        <label class="form-check-label" :for="'smartLayout-' + sample.id">?????????? ?????? ?????????????????? ?</label>
                    </div>
                                        
                    <div class="custom-layout-wrapper" v-if="sample.extraLayout.length">
                        <div class="form-check form-switch mb-1 d-flex justify-content-between" v-for="layout in sample.extraLayout">
                            <input role="switch" type="checkbox" :id="layout.titleLayout + '-' + layout.id" class="form-check-input" name="layout.titleLayout" v-model="layout.isChecked" autocomplete="off">
                            <label class="form-check-label" :for="layout.titleLayout + '-' + layout.id">{{layout.titleLayout}}</label>      
                        </div>
                    </div>
                    
                    <div class="new-layout align-self-start d-flex">
                        <btn-create-new-layout :id="sample.id" @create-new-layout="createNewLayout(sample.id)"></btn-create-new-layout>
                        <div v-if="sample.isNewLayout">
                             <input name="titleLayout" v-model="sample.newTitleLayout" type="text"  class="form-control" @keyup.enter="addNewLayout(sample.id)">
                        </div>

                    </div>
                    
                    <div class="total-wrapper" v-if="sample.resultCost">
                        
                         <div>???????????????????? ?????????? - <b>{{sample.innerTimeResult}}</b></div>
                         <div>???????????? ?????? ?????????????? - <b>{{sample.outTimeResult}}</b></div>
                         <div>?????????????????? ?????????????? - <b>{{sample.resultCost}}</b></div>
                    </div>

                    <btn-remove-sample class="d-flex align-self-end" @remove-sample="removeSample(sample.id)"></btn-remove-sample>
                </div>
            </div>
        </div>
        <btn-add-sapmle @add-sample="addSample"></btn-add-sapmle>
        <div class="total-block-wrapper">
            <span>????????????????????:</span>
           <div 
           v-for="sample in samples"
           :key="sample.id "
           >
                <div class="total-list-block" v-if="sample.resultCost">
                    <div><b>{{sample.nameLayout}}</b></div>
                    <div>???????????????????? ???????????? - <b>{{sample.countBlock}}</b></div>
                    <div v-if="sample.isPCLayout">?????????? ?????? ????</div>
                    <div v-if="sample.isTabletLayout">?????????? ?????? ????????????????</div>
                    <div v-if="sample.isSmartLayout">?????????? ?????? ??????????????????</div>
                    <template v-for="layout in sample.extraLayout">
                            <div v-if="layout.isChecked">{{layout.titleLayout}}</div>
                    </template>
                    
                    
                    <div>?????????? ???????????????????? - <b>{{sample.outTimeResult}}</b></div>
                    <div>?????????????????? ???????????????????? - <b>{{sample.resultCost}}</b></div>
                    <hr>
                </div>
           </div>
           <div v-if="totalOutTime">?????????? ?????????? ???????????????????? ?????? ?????????????? - {{totalOutTime}}</div>
           <div v-if="totalCost">?????????? ?????????????????? ???????????????????? - {{totalCost}}</div>
        </div>
    </div>
    
    `
})

app.component('btn-add-sapmle',{
    emits: ['addSapmle'],
    template: `
        <button @click=$emit("addSample")>
           ???????????????? ????????????
        </button>
    `
})

app.component('btn-remove-sample', {
    emits: ['removeSample'],
    template: `
        <button class="btn btn-danger" @click="$emit('removeSample')">
          <i class="far fa-trash-alt"></i>
        </button>
    `
})

app.component('btn-create-new-layout',{
    emits: ['createNewLayout'],
    template: `
        <button class="btn btn-warning" @click="$emit('createNewLayout')">
          <i class="fa-solid fa-plus"></i>
        </button>
    `
})

// app.component('checkbox-template', {
//     props: ['id', 'typeName', 'checkboxData'],
//     emits: ['changed-box'],
//     data() {
//         return {
//             isChecked: this.checkboxData
//         }
//     },
//     methods: {
//         changeBox() {
//             this.isChecked = !this.isChecked;
//             this.$emit('changed-box', this.isChecked)
//         }
//     },
//     template:`
//         <div class="form-check form-switch mb-3 d-flex justify-content-between">
//             <input
//             role="switch"
//             type="checkbox"
//             :id="typeName + '-' + id"
//             class="form-check-input"
//             :name="typeName"
//             v-model="checkboxData"
//             @change="changeBox"
//             autocomplete="off">
//             <label class="form-check-label" :for="typeName + '-' + id"><slot></slot> {{checkboxData ? "????!" : "??????!"}}</label>
//         </div>
//     `
// })




app.mount('#app');
