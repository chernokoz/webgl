import * as THREE from "three-full";
import car_file from "./resources/RetroRacerOrangeRotated.obj";
import {warn} from "three-full/sources/polyfills";

let instance = null;

export class Map2D {

    constructor(geometry) {
        let loader = new THREE.OBJLoader();

        this.car = loader.parse(car_file);
        this.car.traverse( (child) => {
            if ( child instanceof THREE.Mesh ) {
                child.material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
                child.scale.set(4, 4, 4);
            }
        });

        instance = this;
        this.geometry = geometry;
    }

    posX = 25.0;
    posY = 25.0;
    mesh_size = 5;
    inner_size = 10;

    onKeyDown(e) {
        // const fov = scene.getObjectByName('car');
        // console.log(fov.position);
        if (e.keyCode === 87) {
            instance.posY = succMod(instance.posY, instance.mesh_size * instance.inner_size);
        } else if (e.keyCode === 65) {
            instance.posX = succMod(instance.posX, instance.mesh_size * instance.inner_size);
        } else if (e.keyCode === 83) {
            instance.posY = predMod(instance.posY, instance.mesh_size * instance.inner_size);
        } else if (e.keyCode === 68) {
            instance.posX = predMod(instance.posX, instance.mesh_size * instance.inner_size);
        }
        // console.log(this.posX, this.posY);
        instance.updateCoordinates();

    }

    updateCoordinates () {
        const debug_mode = false;

        let posX = this.posX; let posY = this.posY;
        let inner_size = this.inner_size; let mesh_size = this.mesh_size;

        let triangle, baryCoordinate;

        let indX = Math.floor(posX / inner_size);
        let indY = Math.floor(posY / inner_size);

        let cf1 = posX / inner_size - indX;
        let cf2 = 1 - (posX / inner_size - indX);
        let cf3 = posY / inner_size - indY;

        if (indY === 0) {
            let index1 = 0;
            let index2 = 1 + indX;
            let index3 = 1 + (indX + 1) % mesh_size;

            let point0 = this.geometry.vertices[index1];
            let point1 = this.geometry.vertices[index2];
            let point2 = this.geometry.vertices[index3];

            triangle = new THREE.Triangle(
                point0, point1, point2
            );

            baryCoordinate = new THREE.Vector3(
                2 * (1 - cf3) / (cf1 + cf2 + 2 * (1 - cf3)),
                cf2 / (cf1 + cf2 + 2 * (1 - cf3)),
                cf1 / (cf1 + cf2 + 2 * (1 - cf3))
            );
        } else if (indY === mesh_size - 1) {

            let index1 = 1 + (indY - 1) * mesh_size + indX;
            let index2 = mesh_size * (mesh_size - 1) + 1;
            let index3 = 1 + (indY - 1) * mesh_size + (indX + 1) % mesh_size;

            let point0 = this.geometry.vertices[index1];
            let point1 = this.geometry.vertices[index2];
            let point2 = this.geometry.vertices[index3];

            triangle = new THREE.Triangle(
                point0, point1, point2
            );

            baryCoordinate = new THREE.Vector3(
                cf2 / (cf1 + cf2 + 2 * cf3),
                2 * cf3 / (cf1 + cf2 + 2 * cf3),
                cf1 / (cf1 + cf2 + 2 * cf3),
            );
        } else {
            let index1 = 1 + (indY - 1) * mesh_size + indX;
            let index2 = 1 + (indY - 1) * mesh_size + (indX + 1) % mesh_size;
            let index3 = 1 + indY * mesh_size + indX;
            let index4 = 1 + indY * mesh_size + (indX + 1) % mesh_size;

            let point1 = this.geometry.vertices[index1];
            let point2 = this.geometry.vertices[index2];
            let point3 = this.geometry.vertices[index3];
            let point4 = this.geometry.vertices[index4];

            let triangle1 = new THREE.Triangle(
                new THREE.Vector3(indX, indY, 0),
                new THREE.Vector3(indX, indY + 1, 0),
                new THREE.Vector3(indX + 1, indY + 1, 0)
            );
            let triangle2 = new THREE.Triangle(
                new THREE.Vector3(indX, indY, 0),
                new THREE.Vector3(indX + 1, indY + 1, 0),
                new THREE.Vector3(indX + 1, indY, 0)
            );

            let baryCoordinate1 = triangle1.getBarycoord(new THREE.Vector3(posX / inner_size, posY / inner_size, 0));
            let baryCoordinate2 = triangle2.getBarycoord(new THREE.Vector3(posX / inner_size, posY / inner_size, 0));

            if (baryCoordinate1.x >= 0 && baryCoordinate1.y >= 0 && baryCoordinate1.z >= 0) {
                triangle = new THREE.Triangle(
                    point1, point3, point4
                );
                baryCoordinate = baryCoordinate1;
            } else if (baryCoordinate2.x >= 0 && baryCoordinate2.y >= 0 && baryCoordinate2.z >= 0) {
                triangle = new THREE.Triangle(
                    point1, point4, point2
                );
                baryCoordinate = baryCoordinate2;
            } else {
                warn("PROBLEM WITH TRIANGLES!");
            }
        }

        let point = new THREE.Vector3(0, 0, 0)
            .add(triangle.a.clone().multiplyScalar(baryCoordinate.x))
            .add(triangle.b.clone().multiplyScalar(baryCoordinate.y))
            .add(triangle.c.clone().multiplyScalar(baryCoordinate.z));

        this.car.position.copy(point.add(triangle.getNormal()));
        this.car.lookAt(new THREE.Vector3().add(this.car.position).add(triangle.getNormal()));

        console.log(this.car.position);
    }
}

function succMod(a, b) {
    return (a + 1) % b;
}

function predMod(a, b) {
    if (a - 1 < 0) {
        return a - 1 + b;
    } else {
        return a - 1;
    }
}