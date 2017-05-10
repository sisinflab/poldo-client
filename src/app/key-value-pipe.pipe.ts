import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValuePipe'
})
export class KeyValuePipePipe implements PipeTransform {

  transform(value, args: string[]): any {
    const keys = [];
    for (const key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }

}
