import { Hash, HashedObject, MutableObject, MutationOp, Resources, Space, SpaceEntryPoint, SpaceInit } from '@hyper-hyper-space/core';
import React, { useContext, useState, useEffect } from 'react';


const PeerResources = React.createContext<Resources>(new Resources());

const usePeerResources: () => Resources = () => {
    return useContext(PeerResources);
}

const useSpace = <T extends HashedObject>(init: SpaceInit, broadcast?: boolean) => {
    const resources = usePeerResources();

    const [entryPoint, setEntryPoint] = useState<HashedObject|undefined>(undefined);

    useEffect(() => {

        const space = new Space(init, resources);
        const doBroadcast = broadcast !== undefined? broadcast : init.wordCode !== undefined;
        let initialized = false;
        let destroyed = false;
        space.entryPoint.then(async (obj: HashedObject & SpaceEntryPoint) => {
            if (!destroyed) {

                if (doBroadcast) {
                    space.startBroadcast();
                }

                obj.setResources(resources);
                if (resources.store) {
                    await resources.store.save(obj);
                }
                obj.startSync();

                setEntryPoint(obj);

                initialized = true;
            }
            
        });

        return () => {
            destroyed = true;

            if (initialized) {
                if (doBroadcast) {
                    space.stopBroadcast();
                }

                space.getEntryPoint().then((obj: HashedObject & SpaceEntryPoint) => {
                    obj.stopSync();
                });
            }
            
        };
    }, [init, broadcast, resources]);

    return entryPoint as T|undefined;

};

const useStateObjectByHash = (hash: Hash) => {
    const resources = usePeerResources();
    const [stateObject, setSateObject] = useState<HashedObject | undefined> (undefined);

    useEffect(() => {

        let destroyed = false;

        let stateObj: HashedObject | undefined;
        let mutCallback = (mut: MutationOp) => {
            if (stateObj !== undefined) {
                setSateObject(stateObj);
            }
        }
        resources.store?.load(hash).then((obj: HashedObject|undefined) => {
            stateObj = obj;
            if (obj instanceof MutableObject) {
                if (!destroyed) {

                    obj.watchForChanges(true);
                    obj.loadAllChanges();

                    setSateObject(obj);
                    
                    obj.addMutationCallback(mutCallback);
                }
                
                
            }
            
        });

        return () => {
            destroyed = true;

            if (stateObj !== undefined && stateObj instanceof MutableObject) {
                stateObj.watchForChanges(false);
                stateObj.deleteMutationCallback(mutCallback);
            }

        }
    });

    return stateObject;

};

class StateObject<T extends HashedObject> {

    value?: T;

    constructor(obj?: T) {
        this.value = obj;
    }
}

const useStateObject = <T extends HashedObject>(obj?: T) => {

    const [stateObject, setSateObject] = useState<StateObject<T> | undefined> (new StateObject(obj));

    useEffect(() => {

        let mutCallback = (mut: MutationOp) => {
            console.log('changed state for ' + obj?.hash() + '!')
            setSateObject(new StateObject(obj));
        }

        let destroyed = false;

        if (obj !== undefined && obj instanceof MutableObject) {
            
            obj.watchForChanges(true);
            obj.loadAllChanges().then(() => {
                if (!destroyed) {
                    console.log('sate loaded for ' + obj.hash() + '!');
                    setSateObject(new StateObject(obj));
                    obj.addMutationCallback(mutCallback);    
                }
            });
        }

        return () => {

            destroyed = true;

            if (obj !== undefined && obj instanceof MutableObject) {
                obj.watchForChanges(false);
                obj.deleteMutationCallback(mutCallback);
            }  
        };
    }, [obj]);

    return stateObject;

 };


export { PeerResources, usePeerResources, useSpace, useStateObject, useStateObjectByHash };