// it('Should support the injection of user defined factories with args', () => {

//     interface Ninja {
//       fight(): string;
//       sneak(): string;
//     }

//     interface Weapon {
//       use(): string;
//     }

//     @injectable()
//     class Katana implements Weapon {
//       public use() {
//         return 'katana!';
//       }
//     }

//     @injectable()
//     class Shuriken implements Weapon {
//       public use() {
//         return 'shuriken!';
//       }
//     }

//     @injectable() // Controller
//     class NinjaWithUserDefinedFactory implements Ninja {

//       private _katana: Weapon;
//       private _shuriken: Weapon;

//       public constructor( // Inject a usecase factory
//         @inject('Factory<Weapon>') weaponFactory: (throwable: boolean) => Weapon // throwable is relaced with HTTPResponse
//       ) {
//         this._katana = weaponFactory(false); // UseCaseFactory is given access to the HTTPResponse object here in the controller
//         this._shuriken = weaponFactory(true);
//       }

//       public fight() { return this._katana.use(); }
//       public sneak() { return this._shuriken.use(); }

//     }

//     const container = new Container();
//     container.bind<Ninja>('Ninja').to(NinjaWithUserDefinedFactory);
//     container.bind<Weapon>('Weapon').to(Shuriken).whenTargetTagged('throwable', true);
//     container.bind<Weapon>('Weapon').to(Katana).whenTargetTagged('throwable', false);

//     container.bind<interfaces.Factory<Weapon>>('Factory<Weapon>').toFactory<Weapon, [boolean]>((context) =>
//       (throwable: boolean) =>
//         context.container.getTagged<Weapon>('Weapon', 'throwable', throwable)); // The factory has access to the HTTPResponse object here
//         // we should return a new instance of the usecase here and inject a presenter into it. The presenter contains the http response.
//     const ninja = container.get<Ninja>('Ninja');

//     expect(ninja.fight()).eql('katana!');
//     expect(ninja.sneak()).eql('shuriken!');

//   });