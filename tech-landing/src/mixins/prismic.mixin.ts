import Vue from 'vue';
import Component from 'vue-class-component';
import { PrismicResultsObject } from '@/types/prismic-data';

@Component
export default class PrismicMixin extends Vue {
  prismicService = {

    // TODO: 'this.$prismic.client' doesn't work with localVue, have to add $root

    getByID: (id: string, options: {} = {}) => {
      return this.$root.$prismic.client.getByID(id, options)
        .then((res: any) => {
          if (typeof res !== 'undefined') { return res; } else { throw new Error('Prismic ID Not Found'); }
        })
        .catch(this.prismicErrorHandler);
    },

    getByUID: (type: string, uid: string, options: {} = {}) => {
      return this.$prismic.client.getByUID(type, uid, options)
        .then((res: any) => {
          if (typeof res !== 'undefined') { return res; } else { throw new Error('Prismic UID Not Found'); }
        })
        .catch(this.prismicErrorHandler);
    },
    getByTag: (tag: string | string[], options: {} = {}, type: string | string[] = '') => {
      const predicates = [
        this.$root.$prismic.Predicates.any('document.tags', Array.isArray(tag) ? tag : [tag]),
      ];
      if (type) {
        predicates.push(this.$root.$prismic.Predicates.any('document.type', Array.isArray(type) ? type : [type]));
      }
      return this.$root.$prismic.client
        .query(predicates, options)
        .then((res: any) => {
          if (typeof res !== 'undefined') { return res; } else { throw new Error('Tag Not Found'); }
        })
        .catch(this.prismicErrorHandler);
    },

    getByType: (type: string, options: {} = {}, excludeIds: string[] = []) => {
      const query = [this.$root.$prismic.Predicates.at('document.type', type)];
      // unfortunately $prismic.Predicates.not() doesn't support an array as arg
      excludeIds.forEach((id: string) => {
        query.push(this.$root.$prismic.Predicates.not('document.id', id));
      });
      // start to make api request
      return this.$root.$prismic.client.query(query, options)
        .then((res: any) => {
          if (typeof res !== 'undefined') { return res; } else { throw new Error('No Documents Found of that Type'); }
        })
        .catch(this.prismicErrorHandler);
    },

    // similar to above but for singleton prismic types
    getSingleType: (type: string, options: {} = {}) => {
      return this.$root.$prismic.client.getSingle(type, options)
        .then((res: any) => {
          if (typeof res !== 'undefined') { return res; } else { throw new Error('No Documents Found of that Type'); }
        })
        .catch(this.prismicErrorHandler);
    },

    // this does not return the data i expected it to but maybe we can figure out how to use it correctly
    getByRelationship: (type: string, relationship: string, id: string, options: {} = {}) => {
      return this.$root.$prismic.client
        .query([
          this.$root.$prismic.Predicates.at('document.type', type, relationship, id),
          this.$root.$prismic.Predicates.at(`my.${type}.${relationship}`, id),
        ], options)
        .then((res: any) => {
          if (typeof res !== 'undefined') { return res; } else { throw new Error('Relationship Not Found'); }
        })
        .catch(this.prismicErrorHandler);
    },

    getPreviewUrl: (token: string, linkResolver: (doc: PrismicResultsObject) => string) => {
      return this.$root.$prismic.client.previewSession(token, linkResolver, '/')
        .catch(this.prismicErrorHandler);
    },
  };

  prismicErrorHandler(err: Error) {
    console.log('Error! ' + err.message);
  }
}
