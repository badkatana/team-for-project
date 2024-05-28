import {makeAutoObservable} from 'mobx'

export default class TagsStore { 
    constructor() {
        this.tags = []
        this.popularTags = []
        this.programs = []
        makeAutoObservable(this)
    }

    setTags(tagsArray) {
        this.tags = tagsArray
    }

    setPopularTags(tags) {
        this.popularTags = tags
    }

    setPrograms(programs) {
        this.programs = programs
    }
}