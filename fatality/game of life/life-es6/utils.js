'use strict';

export class Utils
{
    /*
        use this function whenever you need to:
        1. perform a single operation within a nested loop
        2. perform main and sub operations of a nested loop 
    */
    eachTuple(length1, length2, action1, action2)
    {
        var isValid1 = this.isFunction(action1),
            isValid2 = this.isFunction(action2);

        for (let i1 = 0; i1 < length1; i1++)
        {
            if (isValid2) action2(i1);

            if (!isValid1) continue;

            for (let i2 = 0; i2 < length2; i2++)
            {
                action1(i2, i1);
            }
        }
    };

    // return an empty function delegate
    emptyDelegate()
    {
        return () => 
        { 
            return arguments[0];   
        };
    }

    // validate if value is function
    isFunction(value)
    {
        return value instanceof Function;
    }

    // validate if value is object
    isObject(value)
    {
        return value instanceof Object;
    }
}
