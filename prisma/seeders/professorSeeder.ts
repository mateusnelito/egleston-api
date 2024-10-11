import { prisma } from '../../src/lib/prisma';
import { transformToDate } from './seed';

export async function seedProfessor() {
  try {
    // Array of 50 ProfessorContactos
    const professorContactos = [
      {
        telefone: '923026944',
        email: 'pbriars0@squidoo.com',
        outros: 'posuere nonummy integer non velit',
      },
      {
        telefone: '915727030',
        outros:
          'elementum pellentesque quisque porta volutpat erat quisque erat eros',
      },
      { telefone: '958486807', email: 'rcatteroll2@newsvine.com' },
      { telefone: '915559419', email: 'aseamark3@hugedomains.com' },
      { telefone: '949791424', email: 'hburdess4@mysql.com' },
      {
        telefone: '932586663',
        email: 'csholem5@ftc.gov',
        outros: 'eu orci mauris lacinia sapien quis libero nullam',
      },
      { telefone: '924360742', email: 'mmackeller6@opera.com' },
      { telefone: '952709354', email: 'bpenhallurick7@constantcontact.com' },
      { telefone: '930069648', email: 'carchbald8@rakuten.co.jp' },
      { telefone: '942907627' },
      {
        telefone: '947344881',
        email: 'cpetkova@dropbox.com',
        outros: 'semper sapien a libero nam dui',
      },
      {
        telefone: '916490860',
        outros:
          'scelerisque mauris sit amet eros suspendisse accumsan tortor quis',
      },
      { telefone: '914191562', email: 'itotenc@rakuten.co.jp' },
      { telefone: '953415094', email: 'nspensd@loc.gov' },
      { telefone: '928783064', email: 'wspecke@toplist.cz' },
      {
        telefone: '947272245',
        outros: 'rutrum nulla nunc purus phasellus in felis donec',
      },
      { telefone: '953653376', email: 'agrissg@smugmug.com' },
      { telefone: '950086248', email: 'mloughlanh@marriott.com' },
      {
        telefone: '931842822',
        email: 'hpeiseri@xrea.com',
        outros: 'consectetuer eget rutrum at lorem integer tincidunt ante vel',
      },
      {
        telefone: '926301795',
        email: 'swolseyj@usda.gov',
        outros:
          'accumsan tortor quis turpis sed ante vivamus tortor duis mattis',
      },
      { telefone: '958182445', email: 'tofallonk@sphinn.com' },
      {
        telefone: '925729322',
        email: 'cleehanel@intel.com',
        outros: 'lacus morbi quis tortor id nulla ultrices aliquet',
      },
      {
        telefone: '914559541',
        outros: 'phasellus id sapien in sapien iaculis congue vivamus',
      },
      {
        telefone: '919197327',
        email: 'trichardesn@ft.com',
        outros: 'ut rhoncus aliquet pulvinar sed nisl nunc rhoncus dui vel',
      },
      {
        telefone: '950766746',
        email: 'hidwalevanso@jimdo.com',
        outros: 'lectus in est risus auctor',
      },
      {
        telefone: '929429748',
        outros: 'amet eleifend pede libero quis orci nullam molestie nibh',
      },
      {
        telefone: '932455693',
        email: 'rblydenq@nih.gov',
        outros: 'id massa id nisl venenatis lacinia aenean sit amet',
      },
      { telefone: '936746975', email: 'cborderr@wikimedia.org' },
      {
        telefone: '925275323',
        email: 'cmoakess@kickstarter.com',
        outros: 'fusce congue diam id ornare imperdiet sapien urna',
      },
      { telefone: '924792904', email: 'eealest@tamu.edu' },
      { telefone: '947363187' },
      {
        telefone: '953474905',
        email: 'djeannaudv@icq.com',
        outros: 'ligula pellentesque ultrices phasellus id sapien in',
      },
      {
        telefone: '956612160',
        outros:
          'vivamus metus arcu adipiscing molestie hendrerit at vulputate vitae nisl',
      },
      { telefone: '917767384', email: 'kmcilwainx@epa.gov' },
      { telefone: '917030256', email: 'bcushellyy@wisc.edu' },
      { telefone: '952482906', outros: 'ut suscipit a feugiat et' },
      {
        telefone: '941662300',
        email: 'nfortnon10@parallels.com',
        outros:
          'ultrices posuere cubilia curae duis faucibus accumsan odio curabitur',
      },
      { telefone: '914227525', email: 'mpashenkov11@who.int' },
      {
        telefone: '938588938',
        email: 'dleynagh12@umich.edu',
        outros:
          'montes nascetur ridiculus mus etiam vel augue vestibulum rutrum',
      },
      {
        telefone: '946034039',
        outros: 'tristique fusce congue diam id ornare imperdiet sapien',
      },
      {
        telefone: '957250153',
        email: 'cmerricks14@java.com',
        outros: 'etiam faucibus cursus urna ut tellus nulla ut erat id',
      },
      { telefone: '956220713', email: 'dtowers15@cafepress.com' },
      {
        telefone: '954726831',
        email: 'snyssens16@umich.edu',
        outros: 'diam id ornare imperdiet sapien urna pretium',
      },
      {
        telefone: '943924959',
        email: 'emckie17@prweb.com',
        outros: 'blandit non interdum in ante',
      },
      { telefone: '913186382', email: 'bvondrasek18@senate.gov' },
      {
        telefone: '915785846',
        outros:
          'orci nullam molestie nibh in lectus pellentesque at nulla suspendisse',
      },
      {
        telefone: '941627478',
        email: 'chardesty1a@techcrunch.com',
        outros: 'justo in hac habitasse platea dictumst',
      },
      { telefone: '913809471', email: 'lwharrier1b@deviantart.com' },
      { telefone: '932178928', email: 'mnapoli1c@virginia.edu' },
      { telefone: '922335989', email: 'dbenninger1d@so-net.ne.jp' },
    ];

    // Creta 50 Professores
    await prisma.professor.createMany({
      data: [
        {
          nomeCompleto: 'Lilian Stoak',
          dataNascimento: transformToDate('1984/03/15'),
        },
        {
          nomeCompleto: 'Kerry Greave',
          dataNascimento: transformToDate('1995/04/11'),
        },
        {
          nomeCompleto: 'Tommie Firpi',
          dataNascimento: transformToDate('1993/03/14'),
        },
        {
          nomeCompleto: 'Kesley Aveyard',
          dataNascimento: transformToDate('2003/03/17'),
        },
        {
          nomeCompleto: 'Arri Garter',
          dataNascimento: transformToDate('1988/03/21'),
        },
        {
          nomeCompleto: 'Grethel Stobie',
          dataNascimento: transformToDate('1997/06/17'),
        },
        {
          nomeCompleto: 'Catlin Falkous',
          dataNascimento: transformToDate('1997/05/22'),
        },
        {
          nomeCompleto: 'Daniel Gashion',
          dataNascimento: transformToDate('1977/01/25'),
        },
        {
          nomeCompleto: 'Bertie Ledstone',
          dataNascimento: transformToDate('1973/05/21'),
        },
        {
          nomeCompleto: 'Andreana Mughal',
          dataNascimento: transformToDate('1977/02/02'),
        },
        {
          nomeCompleto: 'Iona Greeson',
          dataNascimento: transformToDate('2004/10/08'),
        },
        {
          nomeCompleto: 'Hester Schroter',
          dataNascimento: transformToDate('1989/06/12'),
        },
        {
          nomeCompleto: 'Karin Tregea',
          dataNascimento: transformToDate('1981/12/27'),
        },
        {
          nomeCompleto: 'Kirby Bohlje',
          dataNascimento: transformToDate('1990/08/27'),
        },
        {
          nomeCompleto: 'Carlyn Creany',
          dataNascimento: transformToDate('1974/03/25'),
        },
        {
          nomeCompleto: 'Austin Loche',
          dataNascimento: transformToDate('1999/02/27'),
        },
        {
          nomeCompleto: 'Garek Humphrey',
          dataNascimento: transformToDate('1998/07/22'),
        },
        {
          nomeCompleto: 'Rosmunda Janku',
          dataNascimento: transformToDate('1993/01/27'),
        },
        {
          nomeCompleto: 'Nonnah De Mitris',
          dataNascimento: transformToDate('1987/10/13'),
        },
        {
          nomeCompleto: 'Yorker Norheny',
          dataNascimento: transformToDate('1977/10/15'),
        },
        {
          nomeCompleto: 'Hermy Jewer',
          dataNascimento: transformToDate('1978/01/29'),
        },
        {
          nomeCompleto: 'Kaycee Court',
          dataNascimento: transformToDate('1973/03/20'),
        },
        {
          nomeCompleto: 'Roze Isakovitch',
          dataNascimento: transformToDate('1979/10/12'),
        },
        {
          nomeCompleto: 'Erwin Dent',
          dataNascimento: transformToDate('1981/10/27'),
        },
        {
          nomeCompleto: 'Roanne Ehlerding',
          dataNascimento: transformToDate('1970/04/07'),
        },
        {
          nomeCompleto: 'Lulu Sterland',
          dataNascimento: transformToDate('2003/01/30'),
        },
        {
          nomeCompleto: 'Georgette Tousy',
          dataNascimento: transformToDate('1974/01/16'),
        },
        {
          nomeCompleto: 'Hermione Merle',
          dataNascimento: transformToDate('1995/04/26'),
        },
        {
          nomeCompleto: 'Bartel Seide',
          dataNascimento: transformToDate('1973/04/28'),
        },
        {
          nomeCompleto: 'Hollis Farrans',
          dataNascimento: transformToDate('1996/06/05'),
        },
        {
          nomeCompleto: 'Oneida Rosin',
          dataNascimento: transformToDate('1998/05/28'),
        },
        {
          nomeCompleto: 'Berni Renhard',
          dataNascimento: transformToDate('1982/10/07'),
        },
        {
          nomeCompleto: 'Whitney Gawthorp',
          dataNascimento: transformToDate('1983/04/01'),
        },
        {
          nomeCompleto: 'Tait Dawe',
          dataNascimento: transformToDate('1974/11/02'),
        },
        {
          nomeCompleto: 'Kristoffer Komorowski',
          dataNascimento: transformToDate('1994/04/14'),
        },
        {
          nomeCompleto: 'Abbe Umpleby',
          dataNascimento: transformToDate('1975/06/07'),
        },
        {
          nomeCompleto: 'Kissiah Baud',
          dataNascimento: transformToDate('1987/11/09'),
        },
        {
          nomeCompleto: 'Leonelle Lattka',
          dataNascimento: transformToDate('1994/12/12'),
        },
        {
          nomeCompleto: 'Farrel Greenin',
          dataNascimento: transformToDate('1985/09/07'),
        },
        {
          nomeCompleto: 'Brig Ottam',
          dataNascimento: transformToDate('1993/07/14'),
        },
        {
          nomeCompleto: 'Jourdain Visco',
          dataNascimento: transformToDate('1996/05/28'),
        },
        {
          nomeCompleto: 'Gypsy Rathborne',
          dataNascimento: transformToDate('1970/10/05'),
        },
        {
          nomeCompleto: 'Kennedy Rootes',
          dataNascimento: transformToDate('2002/06/12'),
        },
        {
          nomeCompleto: 'Fawne Brogioni',
          dataNascimento: transformToDate('1982/02/27'),
        },
        {
          nomeCompleto: 'Querida Puttnam',
          dataNascimento: transformToDate('1986/11/04'),
        },
        {
          nomeCompleto: 'Wye Brood',
          dataNascimento: transformToDate('1994/09/04'),
        },
        {
          nomeCompleto: 'Rozella Niezen',
          dataNascimento: transformToDate('1990/06/15'),
        },
        {
          nomeCompleto: 'Yalonda Schooley',
          dataNascimento: transformToDate('1982/10/23'),
        },
        {
          nomeCompleto: 'Lissi Foux',
          dataNascimento: transformToDate('1975/01/21'),
        },
        {
          nomeCompleto: 'Lucinda Guile',
          dataNascimento: transformToDate('1970/09/12'),
        },
      ],
    });

    // Creta 50 Contactos
    await prisma.professorContacto.createMany({
      data: professorContactos.map(({ telefone, email, outros }, i) => ({
        professorId: i + 1,
        telefone,
        email,
        outros,
      })),
    });
  } catch (err) {
    throw new Error(`\nError seeding Professor \n${err}`);
  }
}
