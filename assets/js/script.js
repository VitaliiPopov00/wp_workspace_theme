const workItem = {
    template: `<div class="work-list__item" @click="$emit('showPopup', workItem.id)">
                    <img 
                        :src="homeUrl + workItem.logo" 
                        :alt="workItem.company" 
                        class="work-list__item__img"
                    />
                    <p class="work-list__item__company">{{ workItem.company }}</p>
                    <p class="work-list__item__title">{{ workItem.title }}</p>
                    <ul class="work-list__item__info">
                        <li>{{ (Number(workItem.salary)).toLocaleString("ru-RU") }}₽</li>
                        <li>{{ workItem.type.toLowerCase() }}</li>
                        <li>{{ workItem.format.toLowerCase() }}</li>
                        <li>{{ workItem.experience.toLowerCase() }}</li>
                    </ul>
                </div>`,
    data() {
        return {
            homeUrl: "https://workspace-methed.vercel.app/",
        }
    },
    props: {
        workItem: {
            type: Object,
            required: true,
        }
    },
}

const workList = {
    template: `<section class="work-list" id="work-list">
                    <work-item 
                        v-for="work in works" 
                        :key="work.id" 
                        :workItem="work"
                        @showPopup="$emit('showPopup', $event)"
                    ></work-item>
                </section>`,
    components: {
        workItem,
    },
    data() {
        return {
            works: [],
            homeUrl: "https://workspace-methed.vercel.app",
        }
    },
    methods: {
        async fetchVacancy()
        {
            try {
                let response = await fetch(this.homeUrl + "/api/vacancy");
                let data = await response.json();
                this.works = data.vacancies;
            } catch (e) {
                console.log(e);
            }
        },
    },
    mounted() {
        this.fetchVacancy();
    }
}

const sloganCompany = {
    template: `<section class="slogan container">
                    <h1 class="slogan__text">
                        Найди работу<br />
                        <span>Своей мечты</span>
                    </h1>

                    <img src="${localStorage.getItem('IMG_DIR')}/site/slogan_img.png" alt="img" class="slogan__img" />
                </section>`,
}

const checkboxList = {
    template: `<div class="filter__form__item">
                    <label for="" class="filter__form__item__label">{{ label }}</label>
                    <div 
                        class="filter__form__item__input__section"
                        v-for="checkbox in checkboxes"
                        :key="checkbox.id"
                    >
                        <input 
                            type="checkbox" 
                            class="filter__form_item__checkbox" 
                            :name="checkbox.name" 
                            :id="checkbox.name"
                            v-model="checkbox.value"
                            @change="$emit('update:checkboxes', JSON.parse(JSON.stringify(checkboxes)))"
                        />
                        <label
                            :for="checkbox.name"
                        >{{ checkbox.label }}</label>
                    </div>
                </div>`,
    props: {
        label: {
            type: String,
            required: true,
        },
        checkboxes: {
            type: Array,
            required: true,
        }
    },
}

const mySelect = {
    template: `<div class="filter__form__item">
                    <label for="city_list" class="filter__form__item__label">Город</label>
                    <select 
                        name="city" 
                        id="city_list" 
                        class="filter__form_item__input"
                        :value="modelValue"
                        @change="$emit('update:modelValue', $event.target.value)"
                    >
                        <option value="">Выбрать город</option>
                        <option 
                            v-for="option, index in options" 
                            :value="option"
                            :key="index"
                        >{{ option }}</option>
                    </select>
                </div>`,
    props: {
        modelValue: {
            type: String,
        },
        options: {
            type: Array,
            required: true,
        }
    },
}

const filterForm = {
    template: `<aside class="filter">
                    <p class="filter__link__mobile">
                        Фильтр
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6L8 0H0L4 6Z" fill="#2A18FF" />
                        </svg>
                    </p>
                    <form action="#" method="get" class="filter__form">
                        <div class="filter__form__title">
                            <p class="filter__form__title__text">Фильтр</p>

                            <input type="reset" value="Очистить" class="filter__form__reset" />
                        </div>

                        <my-select
                            :options="cities"
                            v-model="filters.city"
                        ></my-select>

                        <div class="filter__form__item">
                            <label for="salary" class="filter__form__item__label">Заработная плата</label>
                            <div class="filter__form_item__salary">
                                <input 
                                    type="text" 
                                    class="filter__form_item__input" 
                                    name="min_salary" 
                                    id="salary" 
                                    placeholder="от"
                                    v-model="filters.min_salary"
                                    @input="validateSalary('min_salary', $event)"
                                    :class="{ input_error: errors_input.min_salary}"
                                />
                                <input 
                                    type="text" 
                                    class="filter__form_item__input" 
                                    name="max_salary" 
                                    id="salary" 
                                    placeholder="до" 
                                    v-model="filters.max_salary"
                                    @input="validateSalary('max_salary', $event)"
                                    :class="{ input_error: errors_input.max_salary}"
                                />
                            </div>
                        </div>

                        <checkbox-list
                            :label="workFormat.label"
                            v-model:checkboxes="workFormat.checkboxes"
                        ></checkbox-list>

                        <checkbox-list
                            :label="experience.label"
                            v-model:checkboxes="experience.checkboxes"
                        ></checkbox-list>

                        <checkbox-list
                            :label="employment.label"
                            v-model:checkboxes="employment.checkboxes"
                        ></checkbox-list>

                        <div class="filter__form__operation">
                            <input type="submit" class="filter__form__submit btn" value="Применить" />
                            <input type="reset" class="filter__form__reset no-show" value="Очистить" />
                        </div>
                    </form>
                </aside>`,
    components: {
        mySelect,
        checkboxList,
    },
    data() {
        return {
            filters: {
                city: '',
                min_salary: '',
                max_salary: '',
            },
            errors_input: {
                min_salary: false,
                max_salary: false,
            },
            cities: [],
            workFormat: {
                label: "Формат",
                checkboxes: [
                    {
                        id: 1,
                        label: "Офис",
                        name: "format_office",
                        value: false,
                    },
                    {
                        id: 2,
                        label: "Удаленный",
                        name: "format_remote",
                        value: false,
                    },
                    {
                        id: 3,
                        label: "Гибкий",
                        name: "format_flexible",
                        value: false,
                    },
                ],
            },
            experience: {
                label: "Опыт работы",
                checkboxes: [
                    {
                        id: 1,
                        label: "Не важно",
                        name: "experience_no_important",
                        value: false,
                    },
                    {
                        id: 2,
                        label: "Без опыта",
                        name: "experience_none",
                        value: false,
                    },
                    {
                        id: 3,
                        label: "От 1 года до 3-х лет",
                        name: "experience_middle",
                        value: false,
                    },
                    {
                        id: 4,
                        label: "От 3-х лет",
                        name: "experience_big",
                        value: false,
                    },
                ],
            },
            employment: {
                label: "Занятость",
                checkboxes: [
                    {
                        id: 1,
                        label: "Полная",
                        name: "employment_full",
                        value: false,
                    },
                    {
                        id: 2,
                        label: "Частичная",
                        name: "employment_middle",
                        value: false,
                    },
                    {
                        id: 3,
                        label: "Стажировка",
                        name: "employment_intership",
                        value: false,
                    },
                    {
                        id: 4,
                        label: "Проектная работа",
                        name: "employment_project",
                        value: false,
                    },
                ],
            },
            homeUrl: "https://workspace-methed.vercel.app",
        }
    },
    methods: {
        validateSalary(name, event) {
            const value = Number(event.target.value);
            this.errors_input[name] = isNaN(value) || value < 0;
        },
        async fetchCities() {
            try {
                let response = await fetch(this.homeUrl + "/api/locations");
                this.cities = await response.json();
            } catch (e) {

            }
        },
    },
    mounted() {
        this.fetchCities();
    }
}

const myPopup = {
    template: `<section class="popup" v-if="workItem">
                    <div :style="computedStyles">
                        <div class="popup__title">
                            <img 
                                :src="homeUrl + workItem.logo" 
                                alt="img" 
                                class="popup__title__img" />
                            <div class="popup__title__info">
                                <p>{{ workItem.company }}</p>
                                <span>{{ workItem.title }}</span>
                            </div>
                        </div>
                        <div class="popup__body">
                            <div class="popup__info">
                                <p v-html="formattedDescription" />
                            </div>
                            <ul class="popup__tags">
                                <li class="popup__tags__item">от {{ (Number(workItem.salary)).toLocaleString('ru-RU') }}₽</li>
                                <li class="popup__tags__item">{{ workItem.type }}</li>
                                <li class="popup__tags__item">{{ workItem.format }}</li>
                                <li class="popup__tags__item">{{ workItem.experience }}</li>
                                <li class="popup__tags__item">{{ workItem.location }}</li>
                            </ul>
                        </div>
                        <div class="popup__link">
                            Отправляйте резюме на
                            <a href="mailto:CreativePeople@gmail.com">{{ workItem.email }}</a>
                        </div>
                        <img src="${localStorage.getItem('IMG_DIR')}/site/likemen.png" alt="likeman" class="popup__likeman">
                        <img 
                            src="${localStorage.getItem('IMG_DIR')}/site/close.svg" 
                            alt="close" 
                            class="popup__close"
                            @click="$emit('closePopup')">
                    </div>
                </section>`,
    data() {
        return {
            homeUrl: "https://workspace-methed.vercel.app/",
            workItem: false
        }
    },
    props: {
        workItemID: {
            type: String,
            required: true,
        }
    },
    computed: {
        formattedDescription() {
            return this.workItem.description.replace(/\n/g, "<br>");
        },
        computedStyles() {
            const offsetY = window.pageYOffset;

            return {
                marginTop: offsetY + 150 + 'px',
                marginInline: 'auto'
            };
        },
    },
    async mounted() {
        try {
            let response = await fetch(this.homeUrl + "api/vacancy/" + this.workItemID);
            this.workItem = await response.json();
        } catch (e) {
            console.log(e);
        }
    }
}

const app = {
    template: `<slogan-company></slogan-company>
                <div class="main_content container">
                    <filter-form></filter-form>
                    <work-list
                        @showPopup="workItemID = $event"
                    ></work-list>
                </div>
                <my-popup 
                    @closePopup="workItemID = false"
                    :workItemID="workItemID"
                    v-if="workItemID"
                ></my-popup>`,
    data() {
        return {
            workItemID: false,
        }
    },
    components: {
        workList,
        sloganCompany,
        filterForm,
        myPopup,
    },
}

localStorage.setItem('IMG_DIR', 'http://localhost/wp-content/themes/workspace/assets/img');

Vue
    .createApp(app)
    .mount('#app');

// city - город
// pay-from - зп от
// pay-to - зп до
// format - формат
// experience - опыт работы
// type - занятость