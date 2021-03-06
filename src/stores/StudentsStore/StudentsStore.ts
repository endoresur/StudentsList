import { action, configure, makeAutoObservable} from "mobx";
import { Student } from "../../models/EntityModels/students";
import {filterDirection, filterOptions, filterType, IFilterOption} from "../../types/types";
import RootStore from "../RootStore";

configure({
    useProxies: "never"
})

class StudentsStore {
    private _rootStore: RootStore;
    private _list: Student[] = [];
    private _filteredList: Student[] = [];
    private _filter: IFilterOption[] = filterOptions;

    constructor(rootStore: RootStore) {
        this._rootStore = rootStore;

        makeAutoObservable(this, {
            setList: action,
            deleteStudent: action,
            search: action,
            changeFilter: action,
            setFilter: action
        })
    }

    get getList(): Student[] {
        return this._filteredList;
    }

    setList(list: Student[]) {
        this._list = list;
        this._filteredList = this._list;
    }

    deleteStudent(student: Student) {
        let index = this._filteredList.indexOf(student);
        this._filteredList.splice(index, 1);
    }

    search(value: string) {
        if (value.length === 0) {
            this._filteredList = this._list;
            return;
        }
        this._filteredList = this._list.filter(student => {
            return student.name.toLowerCase().includes(value.toLowerCase());
        })
    }

    get getFilter() {
        return this._filter;
    }

    changeFilter(id: number) {
        this._filter = this._filter.map((element) => {
            element.checked = false;
            if (element.id === id) {
                element.checked = true;
                this.setFilter(element)
            }
            return element;
        })
    }

    setFilter(filter: IFilterOption) {
        this._filteredList.sort((first, second) => {
            if (filter.direction === filterDirection.default) {
                return first.id - second.id;
            }
            if (filter.type === filterType.age) {
                if (filter.direction === filterDirection.moreToLess) {
                    return Number(second.birthday) - Number(first.birthday);
                }
                return Number(first.birthday) - Number(second.birthday);
            } else if (filter.type === filterType.name) {
                if (filter.direction === filterDirection.moreToLess) {
                    return first.name.localeCompare(second.name);
                }
                return second.name.localeCompare(first.name);
            } else if (filter.type === filterType.rating) {
                if (filter.direction === filterDirection.moreToLess) {
                    return second.rating - first.rating;
                }
                return first.rating - second.rating;
            }
            return 0;
        })

    }
}

export default StudentsStore;