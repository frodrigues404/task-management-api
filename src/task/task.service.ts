import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TaskDto } from './task.dto';

@Injectable()
export class TaskService {

    private tasks: TaskDto[] = [];

    create(task: TaskDto){
        this.tasks.push(task);
        console.log(this.tasks);
    }

    findById(id: string): TaskDto{
        const foundTask = this.tasks.filter(t => t.id === id);

        if(foundTask.length) {
            console.log(foundTask[0]);
            return foundTask[0];
        }
        
        throw new HttpException(`Task with id ${id} not found`, HttpStatus.NOT_FOUND);
    }

    findAll(params: any): TaskDto[]{
        if(Object.keys(params).length){
            return this.tasks.filter(t => {
                let isValid = true;

                for(let key in params){
                    isValid = isValid && t[key] === params[key];
                }

                return isValid;
            });
        }
        return this.tasks;
    }

    update(task: TaskDto){
        let taskIndex = this.tasks.findIndex(t => t.id === task.id);

        if(taskIndex >= 0){
            this.tasks[taskIndex] = task;
            return;
        }

        throw new HttpException(`Task with id ${task.id} not found`, HttpStatus.NOT_FOUND);
    }

    delete(id: string){
        let taskIndex = this.tasks.findIndex(t => t.id === id);

        if(taskIndex >= 0){
            this.tasks.splice(taskIndex, 1);
            return;
        }

        throw new NotFoundException(`Task with id ${id} not found`);
    }
}
